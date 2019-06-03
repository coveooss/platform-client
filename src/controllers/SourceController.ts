import * as _ from 'underscore';
import { series } from 'async';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Organization } from '../coveoObjects/Organization';
import { Source } from '../coveoObjects/Source';
import { IDiffOptions } from './../commands/DiffCommand';
import { BaseController, IDiffResultArrayClean } from './BaseController';
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
import { Utils } from '../commons/utils/Utils';

interface ITraverseOptions {
  uniqueCombinaisonKeys?: IStringMap<string[]>;
  keysToOmit?: IStringMap<string[]>;
}

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

        // 2. Whitelist only keys that should be graduated
        // 3. Strip source from keys that should not be graduated
        source.removeParameters(options.keyBlacklist || [], options.keyWhitelist || []);
        // TODO: 4 strip ids from mappings
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

  private getCleanArrayDiff(newList: any[], oldList: any[], options: { uniqueKeyCombinaison?: string[]; keysToOmit?: string[] } = {}) {
    const diffList: IDiffResultArrayClean = {
      TO_CREATE: [],
      TO_UPDATE: [],
      TO_DELETE: []
    };
    let temp: any[] = [];

    if (typeof newList[0] === 'object') {
      // We are comparing Objects
      // TODO: compare objetcs
      _.each(newList, (newEntry: any, idx: number) => {
        const condition = options.uniqueKeyCombinaison
          ? (oldEntry: any) =>
              _.reduce(options.uniqueKeyCombinaison || [], (memo, key) => memo && (newEntry as any)[key] === (oldEntry as any)[key], true)
          : (oldEntry: any) => _.isEqual(newEntry, oldEntry);

        const oldEntriesMatches = _.filter(oldList, (oldEntry: any) => condition(oldEntry));
        // const matches = _.filter(oldList, (oldEntry: T) => newEntry.fieldName === oldEntry.fieldName && newEntry.type === oldEntry.type);
        temp = temp.concat(oldEntriesMatches);
        const multipleCombinaisonValue = _.compact(_.map(options.uniqueKeyCombinaison || [], (val: string) => (newEntry as any)[val])).join(
          ' - '
        );
        if (oldEntriesMatches.length > 1) {
          Logger.warn(`Multiple mapping rules with the same type found: ${multipleCombinaisonValue}. Taking the last one.`);
        }
        let oldEntryMatch = _.last(oldEntriesMatches);

        _.each(options.keysToOmit || [], key => {
          newEntry = _.omit(newEntry, key); // Can convert undefined {} to {}
          oldEntryMatch = _.omit(oldEntryMatch, key); // Can convert undefined {} to {}
        });
        // if (options.keysToOmit) {
        //   newEntry = JsonUtils.removeKeyValuePairsFromJson(newEntry, options.keysToOmit);
        //   match = JsonUtils.removeKeyValuePairsFromJson(match, options.keysToOmit);
        // }
        if (!_.isEqual(newEntry, oldEntryMatch)) {
          // First condition is required because of the _.omit function
          if (_.isEqual(oldEntryMatch, {}) || oldEntryMatch === undefined) {
            diffList.TO_CREATE.push(newEntry);
          } else {
            diffList.TO_UPDATE.push({ newValue: newEntry, oldValue: oldEntryMatch });
          }
        }
      });

      const difference = _.difference(oldList, temp);
      diffList.TO_DELETE = difference;
    } else {
      // We are comparing simple types (string, Number, boolean, ...)
      diffList.TO_DELETE = _.difference(oldList, newList);
      diffList.TO_CREATE = _.difference(newList, oldList);
    }
    return diffList;
  }

  traverse(newObject: any, oldObject: any, diffObject: any, options: ITraverseOptions, parentKey?: string): void {
    if (Utils.isNullOrUndefined(oldObject) && Utils.isNullOrUndefined(newObject)) {
      throw Error('Something went wrong during the diff.');
    }

    if (newObject && typeof newObject === 'object') {
      if (Array.isArray(newObject)) {
        // Using a different logic to compare arrays
        const diffArrayOptions: { uniqueKeyCombinaison?: string[]; keysToOmit?: string[] } = {};
        if (parentKey) {
          if (options.uniqueCombinaisonKeys && options.uniqueCombinaisonKeys[parentKey]) {
            diffArrayOptions.uniqueKeyCombinaison = options.uniqueCombinaisonKeys[parentKey];
          }
          if (options.keysToOmit && options.keysToOmit[parentKey]) {
            diffArrayOptions.keysToOmit = options.keysToOmit[parentKey];
          }
        }

        _.extend(diffObject, this.getCleanArrayDiff(newObject, oldObject, diffArrayOptions));
      } else {
        // Check for parameters to delete
        _.mapObject(oldObject, (value, key) => {
          if (newObject[key] === undefined) {
            diffObject[key] = { TO_DELETE: oldObject[key] };
          }
        });

        // Check for parameters to create or update
        _.mapObject(newObject, (value, key) => {
          diffObject[key] = {};
          if (oldObject === undefined) {
            _.extend(diffObject, { TO_CREATE: newObject });
          } else {
            this.traverse(value, oldObject[key], diffObject[key], options, key);
          }
        });
      }
    } else {
      // Comparing tree leaves
      if (!_.isEqual(newObject, oldObject)) {
        _.extend(diffObject, { newValue: newObject, oldValue: oldObject });
      }
    }
  }

  extractionMethod(object: any[], diffOptions: IDiffOptions, oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return _.map(object, (e: Source) => e.getName());
    } else {
      return _.map(oldVersion, (oldSource: Source) => {
        const newSource: Source = _.find(object, (e: Source) => {
          return e.getName() === oldSource.getName();
        });

        // Make sure to ignore keys that were not part of the diff
        const cleanedNewVersion = JsonUtils.removeKeyValuePairsFromJson(
          newSource.getConfiguration(),
          diffOptions.keysToIgnore,
          diffOptions.includeOnly
        );
        const cleanedOldVersion = JsonUtils.removeKeyValuePairsFromJson(
          oldSource.getConfiguration(),
          diffOptions.keysToIgnore,
          diffOptions.includeOnly
        );

        // Traverse the 2 sources to do a indepth diff
        let diffResult: any = {};
        this.traverse(cleanedNewVersion, cleanedOldVersion, diffResult, {
          uniqueCombinaisonKeys: {
            mappings: ['fieldName', 'type']
          },
          keysToOmit: { mappings: ['id'] }
        });

        // Remove all unchanged parameters
        diffResult = JsonUtils.flatten(diffResult);
        _.each(_.allKeys(diffResult), key => {
          if (_.isEqual(diffResult[key], {}) || _.isEqual(diffResult[key], [])) {
            delete diffResult[key];
          }
        });
        diffResult = JsonUtils.unflatten(diffResult);

        return diffResult;
      });
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
