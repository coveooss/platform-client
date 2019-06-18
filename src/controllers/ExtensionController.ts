import * as _ from 'underscore';
import { series } from 'async';
import { RequestResponse } from 'request';
import { IGraduateOptions } from '../commands/GraduateCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { ExtensionAPI } from '../commons/rest/ExtensionAPI';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { Extension } from '../coveoObjects/Extension';
import { Organization } from '../coveoObjects/Organization';
import { IDiffOptions } from './../commands/DiffCommand';
import { BaseController } from './BaseController';
import { Colors } from '../commons/colors';

export class ExtensionController extends BaseController {
  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  static CONTROLLER_NAME: string = 'extensions';

  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Extension>> {
    return this.loadExtensionsForBothOrganizations()
      .then(() => {
        const diffResultArray = DiffUtils.getDiffResult(
          this.organization1.getExtensions(),
          this.organization2.getExtensions(),
          diffOptions
        );
        if (diffResultArray.containsItems()) {
          Logger.verbose('Diff Summary:');
          Logger.verbose(`${diffResultArray.TO_CREATE.length} extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to create`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to delete`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} extension${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to update`);
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
  download(): Promise<IDownloadResultArray> {
    throw new Error('Not Implemented');
  }

  /**
   * Graduates the extensions from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Extension>} diffResultArray
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  graduate(diffResultArray: DiffResultArray<Extension>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
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
    const asyncArray = _.map(diffResult.TO_CREATE, (extension: Extension) => {
      return (callback: any) => {
        ExtensionAPI.createExtension(this.organization2, extension.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created extension ${Colors.extension(extension.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_CREATE_EXTENSIONS
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

  private graduateUpdated(diffResult: DiffResultArray<Extension>): Promise<void[]> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing extension${
        diffResult.TO_UPDATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );
    const asyncArray = _.map(diffResult.TO_UPDATE, (extension: Extension, idx: number) => {
      return (callback: any) => {
        const destinationExtension = diffResult.TO_UPDATE_OLD[idx].getId();
        ExtensionAPI.updateExtension(this.organization2, destinationExtension, extension.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully updated extension ${Colors.extension(extension.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_UPDATE_EXTENSIONS
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

  private graduateDeleted(diffResult: DiffResultArray<Extension>): Promise<void[]> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing extension${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    const asyncArray = _.map(diffResult.TO_DELETE, (extension: Extension) => {
      return (callback: any) => {
        ExtensionAPI.deleteExtension(this.organization2, extension.getId())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created extension ${Colors.extension(extension.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_DELETE_EXTENSIONS
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

  loadExtensionsForBothOrganizations(): Promise<Array<{}>> {
    Logger.verbose('Loading extensions for both organizations.');
    return Promise.all([ExtensionAPI.loadExtensions(this.organization1), ExtensionAPI.loadExtensions(this.organization2)]);
  }

  extractionMethod(object: any[], diffOptions: IDiffOptions, oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return _.map(object, (e: Extension) => e.getConfiguration());
    } else {
      return _.map(oldVersion, (oldExtension: Extension) => {
        const newExtension: Extension = _.find(object, (e: Extension) => {
          return e.getName() === oldExtension.getName();
        });

        const newExtensionModel = newExtension.getConfiguration();
        const oldExtensionModel = oldExtension.getConfiguration();

        // TODO: add keys to ignore here
        const updatedExtensionModel: IStringMap<any> = _.mapObject(newExtensionModel, (val, key) => {
          if (!_.isEqual(oldExtensionModel[key], val) && (!diffOptions.keysToIgnore || diffOptions.keysToIgnore.indexOf(key) === -1)) {
            return { newValue: val, oldValue: oldExtensionModel[key] };
          } else {
            return val;
          }
        });
        return updatedExtensionModel;
      });
    }
  }
}
