import * as _ from 'underscore';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
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

export class SourceController extends BaseController {
  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  static CONTROLLER_NAME: string = 'source';

  // private shouldSkipExtension(diffOptions?: IDiffOptions): boolean {
  //   return (
  //     diffOptions !== undefined &&
  //     diffOptions.keysToIgnore !== undefined &&
  //     _.contains(diffOptions.keysToIgnore, 'postConversionExtensions') &&
  //     _.contains(diffOptions.keysToIgnore, 'preConversionExtensions')
  //   );
  // }

  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Source>> {
    // Do not load extensions if --skipExtension option is present
    const diffActions = [this.loadSourcesForBothOrganizations(), this.loadExtensionsListForBothOrganizations()];
    return Promise.all(diffActions)
      .then(values => {
        const extensionList = values[1] as Array<Array<{}>>; // 2 dim table: extensions per sources
        const sources1 = this.organization1.getSources();
        const sources2 = this.organization2.getSources();

        // No error should be raised here as all extensions defined in a source should be available in the organization
        this.replaceExtensionIdWithName(sources1, extensionList[0]);
        this.replaceExtensionIdWithName(sources2, extensionList[1]);

        const diffResultArray = DiffUtils.getDiffResult(sources1, sources2, diffOptions);
        if (diffResultArray.containsItems()) {
          // TODO: probably not requierd for the diff, but will be for graduate
          // if (diffResultArray.TO_CREATE.length + diffResultArray.TO_DELETE.length > 0) {
          //   throw new Error(
          //     'Inconsistent number of extensions between orgs. Run `graduate-extensions` first or use the --skipExtensions option to ignore extensions.'
          //   );
          // }
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_SOURCES);
        return Promise.reject(err);
      });
  }

  replaceExtensionKey(sourceList: Dictionary<Source>, extensionList: any[], inputKey: string, outputKey: string) {
    // TODO: Can be optimized
    _.each(sourceList.values(), (source: Source) => {
      // Get all extensions associated to the source
      const extensionReplacer = (sourceExtensionsList: Array<IStringMap<string>>) => {
        _.each(sourceExtensionsList, (sourceExt: IStringMap<string>) => {
          Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
          // For each extension associated to the source, replace its id by its name
          const extensionFound = _.find(extensionList, extension => {
            return extension[inputKey] === sourceExt.extensionId;
          });

          if (extensionFound) {
            sourceExt.extensionId = extensionFound[outputKey];
          } else {
            throw new Error('Extension does not exsist: ' + sourceExt.extensionId);
          }
        });
      };

      // Post conversion extensions
      extensionReplacer(source.getPostConversionExtensions());
      // pre conversion extensions
      extensionReplacer(source.getPreConversionExtensions());
    });
  }

  replaceExtensionIdWithName(sourceList: Dictionary<Source>, extensionList: Array<{}>) {
    this.replaceExtensionKey(sourceList, extensionList, 'id', 'name');
  }

  replaceExtensionNameWithId(sourceList: Dictionary<Source>, extensionList: Array<{}>) {
    this.replaceExtensionKey(sourceList, extensionList, 'name', 'id');
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
   * @param {IHTTPGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  graduate(diffResultArray: DiffResultArray<Source>, options: IHTTPGraduateOptions): Promise<any[]> {
    // this.extensionController.loadExtensionsListForBothOrganizations().then(() => {
    // Here, the extensions should have the id of the destination org
    //   // Do graduation stuff
    // });
    // TODO: change the extension name with the destination id
    throw new Error('TODO: graduate command not implemented');
  }

  extractionMethod(object: any[], oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return _.map(object, (e: Source) => e.getConfiguration());
    } else {
      return _.map(oldVersion, (oldSource: Source) => {
        const newSource: Source = _.find(object, (e: Source) => {
          return e.getName() === oldSource.getName();
        });

        const newSourceModel = newSource.getConfiguration();
        const oldSourceModel = oldSource.getConfiguration();

        const updatedSourceModel: IStringMap<any> = _.mapObject(newSourceModel, (val, key) => {
          if (!_.isEqual(oldSourceModel[key], val)) {
            return { newValue: val, oldValue: oldSourceModel[key] };
          } else {
            return val;
          }
        });
        return updatedSourceModel;
      });
    }
  }

  /**
   * Returns a 2 dimension table: extensions per sources
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
