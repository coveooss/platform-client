import * as jsDiff from 'diff';
import { each, find, findWhere, map } from 'underscore';
import * as deepExtend from 'deep-extend';
import { series } from 'async';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Organization } from '../coveoObjects/Organization';
import { Source } from '../coveoObjects/Source';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
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
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { Colors } from '../commons/colors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { FieldAPI } from '../commons/rest/FieldAPI';

export class SourceController extends BaseController {
  private extensionList: Array<Array<{}>> = [];
  private mappingIds: IStringMap<string[]> = {};
  objectName = 'sources';

  // The second organization can be optional in some cases like the download command for instance.
  constructor(private organization1: Organization, private organization2: Organization = new Organization('', '')) {
    super();
  }
  runDiffSequence(diffOptions?: IDiffOptions): Promise<DiffResultArray<Source>> {
    // Do not load extensions if --skipExtension option is present
    const diffActions = [this.loadDataForDiff(diffOptions), this.loadExtensionsListForBothOrganizations()];
    return Promise.all(diffActions)
      .then((values) => {
        this.extensionList = values[1] as Array<Array<{}>>; // 2 dim table: extensions per sources
        const source1 = this.organization1.getSources();
        const source2 = this.organization2.getSources();

        // No error should be raised here as all extensions defined in a source should be available in the organization
        this.replaceExtensionIdWithName(source1, this.extensionList[0]);
        this.replaceExtensionIdWithName(source2, this.extensionList[1]);

        // Do not diff extensions that have been blacklisted
        this.removeExtensionFromSource(source1, this.organization1);
        this.removeExtensionFromSource(source2, this.organization2);

        each(source1.values(), (source) => {
          const mappingIds = source.sortMappingsAndStripIds();
          // Storing the mapping ids for graduation
          this.mappingIds[source.getName()] = mappingIds;
        });
        each(source2.values(), (source) => {
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

  removeExtensionFromSource(sourceList: Dictionary<Source>, org: Organization) {
    each(sourceList.values(), (source: Source) => {
      each(org.getExtensionBlacklist(), (extensionToRemove: string) => {
        source.removeExtension(extensionToRemove, 'pre');
        source.removeExtension(extensionToRemove, 'post');
      });
    });
  }

  replaceExtensionIdWithName(sourceList: Dictionary<Source>, extensionList: Array<{}>) {
    // TODO: Can be optimized
    each(sourceList.values(), (source: Source) => {
      // Get all extensions associated to the source
      const extensionReplacer = (sourceExtensionsList: Array<IStringMap<string>>) => {
        each(sourceExtensionsList, (sourceExt: IStringMap<string>) => {
          Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
          // For each extension associated to the source, replace its id by its name
          const extensionFound = find(extensionList, (extension: IStringMap<string>) => {
            return extension['id'] === sourceExt.extensionId;
          });

          if (extensionFound) {
            sourceExt.extensionId = (extensionFound as IStringMap<string>)['name'];
          } else {
            const message = `The extension ${Colors.extension(sourceExt.extensionId)} does not exist`;
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
      each(sourceExtensionsList, (sourceExt: IStringMap<string>) => {
        Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
        // For each extension associated to the source, replace its id by its name
        const extensionFound = find(extensionList, (extension) => {
          return (extension as any)['name'] === sourceExt.extensionId;
        });

        if (extensionFound) {
          sourceExt.extensionId = (extensionFound as any)['id'];
        } else {
          const message = `The extension ${Colors.extension(sourceExt.extensionId)} does not exist`;
          Logger.error(`${message}. Make sure to graduate extensions first.`);
          throw new Error(message);
        }
      });
    };

    // Post conversion extensions
    extensionReplacer(source.getPostConversionExtensions());
    // pre conversion extensions
    extensionReplacer(source.getPreConversionExtensions());
  }

  duplicateSource(sourceId: string, destinationSourceName: string) {
    // TODO: to implement
  }

  rebuildSource(sourceName: string) {
    return this.getSourceIdWithName(sourceName).then((sourceId: string) => {
      return SourceAPI.rebuildSource(this.organization1, sourceId);
    });
  }

  getSourceIdWithName(sourceName: string): Promise<string> {
    // First load sources from organization
    return new Promise((resolve, reject) => {
      SourceAPI.getAllSources(this.organization1)
        .then((response: RequestResponse) => {
          const source: any = findWhere(response.body, { name: sourceName });
          if (source === undefined || source.id === undefined) {
            reject({ orgId: this.organization1.getId(), message: StaticErrorMessage.NO_SOURCE_FOUND });
          }

          resolve(source.id);

          const sourceId = this.organization1
            .getSources() // Loading all sources
            .getItem(sourceName) // Fetching source object by name
            .getId(); // Get source ID
          resolve(sourceId);
        })
        .catch((err) => {
          this.errorHandler(err, StaticErrorMessage.UNABLE_TO_GET_SOURCE_NAME);
          reject(err);
        });
    });
  }

  runDownloadSequence(): Promise<DownloadResultArray> {
    return SourceAPI.loadSources(this.organization1)
      .then(() => {
        // const resultArray = DownloadUtils.getDownloadResult(this.organization1.getSources());
        // super.downloadCallback(SourceController.CONTROLLER_NAME, resultArray, options);
        return DownloadUtils.getDownloadResult(this.organization1.getSources());
      })
      .catch((err: IGenericError) => {
        // super.stopProcess(StaticErrorMessage.UNABLE_TO_LOAD_SOURCES, err);
        return Promise.reject(err);
      });
  }

  /**
   * Graduates the sources from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Source>} diffResultArray
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  async runGraduateSequence(diffResultArray: DiffResultArray<Source>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating Sources');

      const graduationCleanup = (sourceList: Source[], stripParams = false) => {
        each(sourceList, (source) => {
          // Make some assertions here. Return an error if an extension is missing
          // 1. Replacing extensions with destination id
          this.replaceExtensionNameWithId(source, this.extensionList[1]);

          // 2. Strip source from keys that should not be graduated using whitelist and blacklist strategy
          //    Should apply to "TO_UPDATE" sources only
          if (stripParams) {
            source.removeParameters(options.keyBlacklist || [], options.keyWhitelist || []);
          }

          // 3. Put back the mapping ids to make sure the platform keeps the mapping order by not generating other mapping ids
          //    This applies to TO_UPDATE and TO_CREATE sources
          if (this.mappingIds[source.getName()]) {
            // TO_DELETE sources do not have mapping ids to restore
            source.restoreMappingIds(this.mappingIds[source.getName()]);
          }
        });
      };

      graduationCleanup(diffResultArray.TO_CREATE);
      graduationCleanup(diffResultArray.TO_UPDATE, true);
      graduationCleanup(diffResultArray.TO_DELETE);

      if (options.ensureFieldIntegrity) {
        await this.loadFieldsFromOnlyOneOrganization(this.organization2);
      }

      return Promise.all(
        map(
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
    const asyncArray = diffResult.TO_CREATE.map((source: Source) => {
      return (callback: any) => {
        // Check if source contains security provider. That is the case for sources like Salesforce.
        if (source.sourceContainsSecurityProvider()) {
          const err = new Error(
            'Cannot create source with security provider. Please create the source manually in the destination org first.'
          );
          callback(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.CANNOT_CREATE_SECURITY_PROVIDER_SOURCE
          );
          return;
        }

        // Check if field integrity is preserved
        const missingFields = this.organization2.getMissingFieldsBasedOnSourceMapping(source);
        if (this.organization2.getFields().values().length > 0 && missingFields.length > 0) {
          const message = `You are attempting to graduate a source that references unavailable fields. Source ${Colors.source(
            source.getName()
          )} requires the following field(s): ${missingFields.join(', ')}`;
          const err = new Error(message);
          callback(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.FIELD_INTEGRITY_BROKEN
          );
          return;
        }

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
    const asyncArray = diffResult.TO_UPDATE.map((source: Source, idx: number) => {
      return (callback: any) => {
        const destinationSource = diffResult.TO_UPDATE_OLD[idx];
        const missingFields = this.organization2.getMissingFieldsBasedOnSourceMapping(source);
        if (this.organization2.getFields().values().length > 0 && missingFields.length > 0) {
          const message = `You are attempting to graduate a source that references unavailable fields. Source ${Colors.source(
            source.getName()
          )} requires the following fields: ${missingFields.join(', ')}`;
          const err = new Error(message);
          callback(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.FIELD_INTEGRITY_BROKEN
          );
          return;
        }
        // Update the source by extending the old source config with the new conifg
        SourceAPI.updateSource(
          this.organization2,
          destinationSource.getId(),
          deepExtend({}, destinationSource.getConfiguration(), source.getConfiguration())
        )
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
    const asyncArray = diffResult.TO_DELETE.map((source: Source) => {
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
      return object.map((e: Source) => e.getName());
    } else {
      const sourceDiff: Array<{ [sourceName: string]: jsDiff.Change[] }> = [];
      oldVersion.map((oldSource: Source) => {
        const newSource: Source | undefined = find(object, (e: Source) => {
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

  private loadDataForDiff(diffOptions?: IDiffOptions): Promise<{}> {
    if (diffOptions && diffOptions.originData) {
      Logger.verbose('Loading sources from local file');
      if (!Array.isArray(diffOptions.originData)) {
        Logger.error('Should provide an array of sources');
        throw { orgId: 'LocalFile', message: 'Should provide an array of sources' };
      }
      try {
        this.organization1.addSourceList(diffOptions.originData);
      } catch (error) {
        // if (error && error.message === StaticErrorMessage.MISSING_SOURCE_ID) {
        //   // TODO: find a cleaner way to upload local file without error
        //   // Expected error
        //   Logger.verbose('Skipping error since the missing id from the local file is expected');
        // } else {
        //   Logger.error('Invalid origin data');
        //   throw error;
        // }
        Logger.error('Invalid origin data');
        throw error;
      }
      return SourceAPI.loadSources(this.organization2);
    } else {
      return this.loadSourcesForBothOrganizations();
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

  loadFieldsFromOnlyOneOrganization(organization: Organization): Promise<{}> {
    Logger.loadingTask(`Loading fields from organization ${Colors.organization(organization.getId())}`);
    return FieldAPI.loadFields(organization);
  }
}
