import * as _ from 'underscore';
import { series } from 'async';
import { RequestResponse } from 'request';
import { IGraduateOptions } from '../commands/GraduateCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { Organization } from '../coveoObjects/Organization';
import { IDiffOptions } from './../commands/DiffCommand';
import { BaseController } from './BaseController';
import { Colors } from '../commons/colors';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { Page } from '../coveoObjects/Page';
import { PageAPI } from '../commons/rest/PageAPI';

export class PageController extends BaseController {
  // The second organization can be optional in some cases like the download command for instance.
  constructor(private organization1: Organization, private organization2: Organization = new Organization('', '')) {
    super();
  }

  static CONTROLLER_NAME: string = 'pages';

  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Page>> {
    return this.loadPagesForBothOrganizations()
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
  download(): Promise<DownloadResultArray> {
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
  graduate(diffResultArray: DiffResultArray<Page>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating Pages');
      return Promise.all(
        _.map(
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
    const asyncArray = _.map(diffResult.TO_CREATE, (page: Page) => {
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
    const asyncArray = _.map(diffResult.TO_UPDATE, (page: Page, idx: number) => {
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
    const asyncArray = _.map(diffResult.TO_DELETE, (page: Page) => {
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

  loadPagesForBothOrganizations(): Promise<Array<{}>> {
    Logger.verbose('Loading pages for both organizations.');
    return Promise.all([PageAPI.loadPages(this.organization1), PageAPI.loadPages(this.organization2)]);
  }

  extractionMethod(object: any[], diffOptions: IDiffOptions, oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return _.map(object, (p: Page) => p.getConfiguration());
    } else {
      return _.map(oldVersion, (oldPage: Page) => {
        const newPage: Page = _.find(object, (e: Page) => {
          return e.getName() === oldPage.getName();
        });

        const newPageModel = newPage.getConfiguration();
        const oldPageModel = oldPage.getConfiguration();

        // TODO: add keys to ignore here
        const updatedPageModel: IStringMap<any> = _.mapObject(newPageModel, (val, key) => {
          if (!_.isEqual(oldPageModel[key], val) && (!diffOptions.keysToIgnore || diffOptions.keysToIgnore.indexOf(key) === -1)) {
            return { newValue: val, oldValue: oldPageModel[key] };
          } else {
            return val;
          }
        });
        return updatedPageModel;
      });
    }
  }
}
