import * as jsDiff from 'diff';
import { find, map } from 'underscore';
import { series } from 'async';
import { RequestResponse } from 'request';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { Organization } from '../coveoObjects/Organization';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { BaseController } from './BaseController';
import { Colors } from '../commons/colors';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { Page } from '../coveoObjects/Page';
import { PageAPI } from '../commons/rest/PageAPI';
import { Assert } from '../commons/misc/Assert';

export class PageController extends BaseController {
  objectName = 'pages';
  // The second organization can be optional in some cases like the download command for instance.
  constructor(private organization1: Organization, private organization2: Organization = new Organization('', '')) {
    super();
  }
  runDiffSequence(diffOptions?: IDiffOptions): Promise<DiffResultArray<Page>> {
    return this.loadDataForDiff(diffOptions)
      .then(() => {
        const diffResultArray = DiffUtils.getDiffResult(this.organization1.getPages(), this.organization2.getPages(), diffOptions);
        if (diffResultArray.containsItems()) {
          Logger.verbose('Diff Summary:');
          Logger.verbose(`${diffResultArray.TO_CREATE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to create`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to delete`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to update`);
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_PAGES);
        return Promise.reject(err);
      });
  }

  /**
   * @param {string} organization
   * @returns {Promise<DownloadResultArray>}
   * @memberof PageController
   */
  runDownloadSequence(): Promise<DownloadResultArray> {
    return PageAPI.loadPages(this.organization1)
      .then(() => {
        return DownloadUtils.getDownloadResult(this.organization1.getPages());
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_PAGES);
        return Promise.reject(err);
      });
  }

  /**
   * Graduates the pages from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Page>} diffResultArray
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  runGraduateSequence(diffResultArray: DiffResultArray<Page>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating Pages');
      return Promise.all(
        map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<Page>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No page to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<Page>): Promise<void[]> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new page${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    const asyncArray = diffResult.TO_CREATE.map((page: Page) => {
      return (callback: any) => {
        PageAPI.createPage(this.organization2, page.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created page ${Colors.page(page.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_CREATE_PAGES
            );
          });
      };
    });

    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  private graduateUpdated(diffResult: DiffResultArray<Page>): Promise<void[]> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing page${diffResult.TO_UPDATE.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    const asyncArray = diffResult.TO_UPDATE.map((page: Page, idx: number) => {
      return (callback: any) => {
        const destinationPage = diffResult.TO_UPDATE_OLD[idx].getId();
        PageAPI.updatePage(this.organization2, destinationPage, page.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully updated page ${Colors.page(page.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_UPDATE_PAGES
            );
          });
      };
    });
    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  private graduateDeleted(diffResult: DiffResultArray<Page>): Promise<void[]> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing pages${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    const asyncArray = diffResult.TO_DELETE.map((page: Page) => {
      return (callback: any) => {
        PageAPI.deletePage(this.organization2, page.getId())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created page ${Colors.page(page.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_DELETE_PAGES
            );
          });
      };
    });

    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  private loadDataForDiff(diffOptions?: IDiffOptions): Promise<{}> {
    if (diffOptions && diffOptions.originData) {
      Logger.verbose('Loading pages from local file');
      if (!Array.isArray(diffOptions.originData)) {
        Logger.error('Should provide an array of pages');
        throw { orgId: 'LocalFile', message: 'Should provide an array of pages' };
      }
      try {
        this.organization1.addPageList(diffOptions.originData);
      } catch (error) {
        // if (error && error.message === StaticErrorMessage.MISSING_PAGE_ID) {
        //   // TODO: find a cleaner way to upload local file without error
        //   // Expected error
        //   Logger.verbose('Skipping error since the missing id from the local file is expected');
        // } else {
        // Logger.error('Invalid origin data');
        // throw error;
        // }
        Logger.error('Invalid origin data');
        throw error;
      }
      return PageAPI.loadPages(this.organization2);
    } else {
      return this.loadPagesForBothOrganizations();
    }
  }

  loadPagesForBothOrganizations(): Promise<Array<{}>> {
    Logger.verbose('Loading pages for both organizations.');
    return Promise.all([PageAPI.loadPages(this.organization1), PageAPI.loadPages(this.organization2)]);
  }

  extractionMethod(
    object: Page[],
    diffOptions: IDiffOptions,
    oldVersion?: Page[]
  ): string[] | Array<{ [pageName: string]: jsDiff.Change[] }> {
    if (oldVersion === undefined) {
      // returning pages to create and to delete
      return object.map((e: Page) => e.getName());
    } else {
      const pageDiff: Array<{ [pageName: string]: jsDiff.Change[] }> = [];
      oldVersion.map((oldPage: Page) => {
        const newPage: Page | undefined = find(object, (e: Page) => {
          return e.getName() === oldPage.getName();
        });
        Assert.isNotUndefined(newPage, `Something went wrong in the page diff. Unable to find ${oldPage.getName()}`);

        const oldPageFormatted = oldPage
          .getHTML()
          .replace(/\\n/g, '\n')
          .replace(/<\/script>/g, '<\\/script>');
        const newPageFormatted = (newPage as Page)
          .getHTML()
          .replace(/\\n/g, '\n')
          .replace(/<\/script>/g, '<\\/script>');

        pageDiff.push({ [(newPage as Page).getName()]: jsDiff.diffJson(oldPageFormatted, newPageFormatted) });
      });
      return pageDiff;
    }
  }
}
