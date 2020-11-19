import * as jsDiff from 'diff';
import { map } from 'underscore';
import { series } from 'async';
import { RequestResponse } from 'request';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Colors } from '../commons/colors';
import { PageResourceAPI } from '../commons/rest/PageResourceAPI';
import { PageResource } from '../coveoObjects/PageResource';
import { Page } from '../coveoObjects/Page';
import { BaseController } from './BaseController';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Organization } from '../coveoObjects/Organization';

/**
 * This has to go away. This is a temporary class until we support resource snapshots
 *
 * @export
 * @class PageJavascriptResourceController
 * @extends {BaseController}
 */
export class PageJavascriptResourceController extends BaseController {
  objectName = 'page-resources';
  // The second organization can be optional in some cases like the download command for instance.
  constructor(private organization2: Organization, private page1: Page, private page2: Page) {
    super();
  }
  runDiffSequence(diffOptions?: IDiffOptions): Promise<DiffResultArray<PageResource>> {
    // return this.loadDataForDiff(diffOptions).then(() => {
    // Hack to support same structure
    return new Promise((resolve, reject) => {
      const diffResultArray = DiffUtils.getDiffResult(this.page1.getJavascript(), this.page2.getJavascript(), diffOptions);
      if (diffResultArray.containsItems()) {
        Logger.verbose('Diff Summary:');
        Logger.verbose(`${diffResultArray.TO_CREATE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to create`);
        Logger.verbose(`${diffResultArray.TO_DELETE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to delete`);
        Logger.verbose(`${diffResultArray.TO_UPDATE.length} page${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to update`);
      }
      return diffResultArray;
    });
  }

  runDownloadSequence(): Promise<DownloadResultArray> {
    throw new Error('To implement');
  }

  runGraduateSequence(diffResultArray: DiffResultArray<PageResource>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating Page Resources');
      return Promise.all(
        map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<PageResource>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No page resources to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<PageResource>): Promise<void[]> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new page resource${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${this.page2.getName()} `
    );
    const asyncArray = diffResult.TO_CREATE.map((pageResource: PageResource) => {
      return (callback: any) => {
        PageResourceAPI.createJavascriptResource(this.organization2, this.page2.getId(), pageResource.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created page resource ${Colors.page(pageResource.getName())}`);
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

  private graduateUpdated(diffResult: DiffResultArray<PageResource>): Promise<void[]> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing page resource${
        diffResult.TO_UPDATE.length > 1 ? 's' : ''
      } in ${this.page2.getName()} `
    );
    const asyncArray = diffResult.TO_UPDATE.map((pageResource: PageResource, idx: number) => {
      return (callback: any) => {
        const resourceName = diffResult.TO_UPDATE_OLD[idx].getName();
        PageResourceAPI.updateJavascriptResource(this.organization2, this.page2.getId(), resourceName, pageResource.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully updated page ${Colors.page(pageResource.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler({ orgId: this.page2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_UPDATE_PAGES);
          });
      };
    });
    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  private graduateDeleted(diffResult: DiffResultArray<PageResource>): Promise<void[]> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing pages${diffResult.TO_CREATE.length > 1 ? 's' : ''} from ${this.page2.getId()} `
    );
    const asyncArray = diffResult.TO_DELETE.map((pageResource: PageResource) => {
      return (callback: any) => {
        PageResourceAPI.deleteJavascriptResource(this.organization2, this.page2.getId(), pageResource.getName())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created page ${Colors.page(pageResource.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler({ orgId: this.page2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_DELETE_PAGES);
          });
      };
    });

    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  // loadPagesForBothOrganizations(): Promise<Array<{}>> {
  //   Logger.verbose('Loading pages for both organizations.');
  //   return Promise.all([PageResourceAPI.loadPages(this.organization1), PageResourceAPI.loadPages(this.page2)]);
  // }

  extractionMethod(
    object: Page[],
    diffOptions: IDiffOptions,
    oldVersion?: Page[]
  ): string[] | Array<{ [pageName: string]: jsDiff.Change[] }> {
    throw new Error('To implement');
  }
}
