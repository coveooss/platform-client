import * as jsDiff from 'diff';
import * as _ from 'underscore';
import { series } from 'async';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Organization } from '../coveoObjects/Organization';
import { Source } from '../coveoObjects/Source';
import { IDiffOptions } from './../commands/DiffCommand';
import { BaseController } from './BaseController';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { Logger } from '../commons/logger';
import { SourceAPI } from '../commons/rest/SourceAPI';
import { Dictionary } from '../commons/collections/Dictionary';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { ExtensionAPI } from '../commons/rest/ExtensionAPI';
import { RequestResponse } from 'request';
import { IGraduateOptions } from '../commands/GraduateCommand';
import { Colors } from '../commons/colors';
import { JsonUtils } from '../commons/utils/JsonUtils';

export class SourceController extends BaseController {
  private extensionList: Array<Array<{}>> = [];

  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  static CONTROLLER_NAME: string = 'sources';

  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Source>> {
    // Do not load extensions if --skipExtension option is present
    const diffActions = [this.loadSourcesForBothOrganizations(), this.loadExtensionsListForBothOrganizations()];
    return Promise.all(diffActions)
      .then(values => {
        this.extensionList = values[1] as Array<Array<{}>>; // 2 dim table: extensions per sources
        const source1 = this.organization1.getSources();
        const source2 = this.organization2.getSources();

        // No error should be raised here as all extensions defined in a source should be available in the organization
        this.replaceExtensionIdWithName(source1, this.extensionList[0]);
        this.replaceExtensionIdWithName(source2, this.extensionList[1]);

        // Do not diff extensions that have been blacklisted
        // Only applies to the organization of origin
        this.removeExtensionFromOriginSource(source1);

        _.each([...source1.values(), ...source2.values()], source => {
          source.sortMappingsAndStripIds();
        });

        const diffResultArray = DiffUtils.getDiffResult(source1, source2, diffOptions);
        if (diffResultArray.containsItems()) {
          Logger.verbose(`${diffResultArray.TO_CREATE.length} source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to create`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to delete`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} to update`);
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_SOURCES);
        return Promise.reject(err);
      });
  }

  removeExtensionFromOriginSource(sourceList: Dictionary<Source>) {
    _.each(sourceList.values(), (source: Source) => {
      _.each(this.organization1.getExtensionBlacklist(), (extensionToRemove: string) => {
        source.removeExtension(extensionToRemove, 'pre');
        source.removeExtension(extensionToRemove, 'post');
      });
    });
  }

  replaceExtensionIdWithName(sourceList: Dictionary<Source>, extensionList: Array<{}>) {
    // TODO: Can be optimized
    _.each(sourceList.values(), (source: Source) => {
      // Get all extensions associated to the source
      const extensionReplacer = (sourceExtensionsList: Array<IStringMap<string>>) => {
        _.each(sourceExtensionsList, (sourceExt: IStringMap<string>) => {
          Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
          // For each extension associated to the source, replace its id by its name
          const extensionFound = _.find(extensionList, (extension: IStringMap<string>) => {
            return extension['id'] === sourceExt.extensionId;
          });

          if (extensionFound) {
            sourceExt.extensionId = (extensionFound as IStringMap<string>)['name'];
          } else {
            const message = `The extension ${Colors.extension(sourceExt.extensionId)} does not exsist`;
            Logger.error(`${message}`);
            throw new Error(message);
          }
        });
      };

      // Post conversion extensions
      extensionReplacer(source.getPostConversionExtensions());
      // pre conversion extensions
      extensionReplacer(source.getPreConversionExtensions());
    });
  }

  replaceExtensionNameWithId(source: Source, extensionList: Array<{}>) {
    // Get all extensions associated to the source
    const extensionReplacer = (sourceExtensionsList: Array<IStringMap<string>>) => {
      _.each(sourceExtensionsList, (sourceExt: IStringMap<string>) => {
        Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
        // For each extension associated to the source, replace its id by its name
        const extensionFound = _.find(extensionList, extension => {
          return (extension as any)['name'] === sourceExt.extensionId;
        });

        if (extensionFound) {
          sourceExt.extensionId = (extensionFound as any)['id'];
        } else {
          const message = `The extension ${Colors.extension(sourceExt.extensionId)} does not exsist`;
          Logger.error(`${message}. Make sure to graduate extensions first`);
          throw new Error(message);
        }
      });
    };

    // Post conversion extensions
    extensionReplacer(source.getPostConversionExtensions());
    // pre conversion extensions
    extensionReplacer(source.getPreConversionExtensions());
  }

  /**
   *
   * @param {string} organization
   * @returns {Promise<IDownloadResultArray>}
   * @memberof SourceController
   */
  download(organization: string): Promise<IDownloadResultArray> {
    throw new Error('TODO: download method not implemented');
  }

  /**
   * Graduates the sources from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Source>} diffResultArray
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  graduate(diffResultArray: DiffResultArray<Source>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating Sources');

      _.each(_.union(diffResultArray.TO_CREATE, diffResultArray.TO_DELETE, diffResultArray.TO_UPDATE), source => {
        // Make some assertions here. Return an error if an extension is missing
        // 1. Replacing extensions with destination id
        this.replaceExtensionNameWithId(source, this.extensionList[1]);

        // 3. Strip source from keys that should not be graduated using whitelist and blacklist strategy
        source.removeParameters(options.keyBlacklist || [], options.keyWhitelist || []);
      });

      return Promise.all(
        _.map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<Source>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No sources to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<Source>): Promise<void[]> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new source${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    const asyncArray = _.map(diffResult.TO_CREATE, (source: Source) => {
      return (callback: any) => {
        SourceAPI.createSource(this.organization2, source.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully created source ${Colors.source(source.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_CREATE_SOURCE
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

  private graduateUpdated(diffResult: DiffResultArray<Source>): Promise<void[]> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing source${
        diffResult.TO_UPDATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );
    const asyncArray = _.map(diffResult.TO_UPDATE, (source: Source, idx: number) => {
      return (callback: any) => {
        const destinationSource = diffResult.TO_UPDATE_OLD[idx].getId();
        SourceAPI.updateSource(this.organization2, destinationSource, source.getConfiguration())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully updated source ${Colors.source(source.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_UPDATE_SOURCE
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

  private graduateDeleted(diffResult: DiffResultArray<Source>): Promise<void[]> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing source${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    const asyncArray = _.map(diffResult.TO_DELETE, (source: Source) => {
      return (callback: any) => {
        SourceAPI.deleteSource(this.organization2, source.getId())
          .then((response: RequestResponse) => {
            callback(null, response);
            this.successHandler(response, `Successfully deleted source ${Colors.source(source.getName())}`);
          })
          .catch((err: any) => {
            callback(err);
            this.errorHandler(
              { orgId: this.organization2.getId(), message: err } as IGenericError,
              StaticErrorMessage.UNABLE_TO_DELETE_SOURCE
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

  /**
   * Returns a string or 2 dimensions table: jsDiff per sources.
   * If the source should be created or deleted, then the function just return the source name. Returning the entire source configueration is not necessary here.
   * If the source has been updated, the function returns a 2 dimension table using the jsDiff package.
   */
  extractionMethod(
    object: Source[],
    diffOptions: IDiffOptions,
    oldVersion?: Source[]
  ): string[] | Array<{ [sourceName: string]: jsDiff.Change[] }> {
    if (oldVersion === undefined) {
      // returning sources to create and to delete
      return _.map(object, (e: Source) => e.getName());
    } else {
      const sourceDiff: Array<{ [sourceName: string]: jsDiff.Change[] }> = [];
      _.map(oldVersion, (oldSource: Source) => {
        const newSource: Source | undefined = _.find(object, (e: Source) => {
          return e.getName() === oldSource.getName();
        });
        Assert.isNotUndefined(newSource, `Something went wrong in the source diff. Unable to find ${oldSource.getName()}`);
        // Make sure to ignore keys that were not part of the diff
        const cleanedNewVersion: any = JsonUtils.removeKeyValuePairsFromJson(
          (newSource as Source).getConfiguration(),
          diffOptions.keysToIgnore,
          diffOptions.includeOnly
        );
        const cleanedOldVersion: any = JsonUtils.removeKeyValuePairsFromJson(
          oldSource.getConfiguration(),
          diffOptions.keysToIgnore,
          diffOptions.includeOnly
        );

        sourceDiff.push({ [(newSource as Source).getName()]: jsDiff.diffJson(cleanedOldVersion, cleanedNewVersion) });
      });
      return sourceDiff;
    }
  }

  /**
   * Returns a 2 dimensions table: extensions per sources
   *
   * @returns {Promise<Array<Array<{}>>>}
   */
  loadExtensionsListForBothOrganizations(): Promise<Array<Array<{}>>> {
    Logger.verbose('Loading extensions for both organizations.');
    return Promise.all([ExtensionAPI.getExtensionList(this.organization1), ExtensionAPI.getExtensionList(this.organization2)]);
  }

  loadSourcesForBothOrganizations(): Promise<Array<{}>> {
    Logger.verbose('Loading sources from both organizations.');
    return Promise.all([SourceAPI.loadSources(this.organization1), SourceAPI.loadSources(this.organization2)]);
  }
}
