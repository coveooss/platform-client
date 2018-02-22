import * as _ from 'underscore';
import { IDiffOptions } from './../commands/DiffCommand';
import { Extension } from '../coveoObjects/Extension';
import { Logger } from '../commons/logger';
import { StaticErrorMessage, IGenericError } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { BaseController } from './BaseController';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionAPI } from '../commons/rest/ExtensionAPI';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { RequestResponse } from 'request';
import { DownloadResultArray, IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';

export class ExtensionController extends BaseController {
  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  static CONTROLLER_NAME: string = 'extensions';

  public diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Extension>> {
    return this.loadExtensionsForBothOrganizations(this.organization1, this.organization2)
      .then(() => {
        const diffResultArray = DiffUtils.getDiffResult(
          this.organization1.getExtensions(),
          this.organization2.getExtensions(),
          diffOptions
        );
        if (diffResultArray.containsItems()) {
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_EXTENTIONS);
        return Promise.reject(err);
      });
  }

  /**
   * Not implemented
   *
   * @param {string} organization
   * @returns {Promise<IDownloadResultArray>}
   * @memberof ExtensionController
   */
  public download(organization: string): Promise<IDownloadResultArray> {
    throw new Error('Not Implemented');
  }

  /**
   * Graduates the extensions from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Extension>} diffResultArray
   * @param {IHTTPGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  public graduate(diffResultArray: DiffResultArray<Extension>, options: IHTTPGraduateOptions): Promise<any[]> {
    if (diffResultArray.TO_CREATE.length > 0) {
      Logger.loadingTask('Graduating Extensions');
      return Promise.all(
        _.map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<Extension>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No extension to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<Extension>): Promise<void[]> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new extension${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    return Promise.all(
      _.map(diffResult.TO_CREATE, (extension: Extension) => {
        return ExtensionAPI.createExtension(this.organization2, extension.getExtensionModel())
          .then((response: RequestResponse) => {
            this.successHandler(response, 'POST operation successfully completed');
          })
          .catch((err: any) => {
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_CREATE_EXTENSIONS
            );
          });
      })
    );
  }

  private graduateUpdated(diffResult: DiffResultArray<Extension>): Promise<void[]> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing extension${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );
    return Promise.all(
      _.map(diffResult.TO_UPDATE, (extension: Extension) => {
        return ExtensionAPI.updateExtension(this.organization2, extension.getId(), extension.getExtensionModel())
          .then((response: RequestResponse) => {
            this.successHandler(response, 'PUT operation successfully completed');
          })
          .catch((err: any) => {
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_UPDATE_EXTENSIONS
            );
          });
      })
    );
  }

  private graduateDeleted(diffResult: DiffResultArray<Extension>): Promise<void[]> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing extension${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    return Promise.all(
      _.map(diffResult.TO_DELETE, (extension: Extension) => {
        return ExtensionAPI.deleteExtension(this.organization2, extension.getId())
          .then((response: RequestResponse) => {
            this.successHandler(response, 'DELETE operation successfully completed');
          })
          .catch((err: any) => {
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_DELETE_EXTENSIONS
            );
          });
      })
    );
  }

  private loadExtensionsForBothOrganizations(organization1: Organization, organization2: Organization): Promise<{}[]> {
    Logger.verbose('Loading extensions for both organizations.');
    return Promise.all([ExtensionAPI.loadExtensions(organization1), ExtensionAPI.loadExtensions(organization2)]);
  }
}
