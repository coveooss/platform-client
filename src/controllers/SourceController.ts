import * as _ from 'underscore';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Organization } from '../coveoObjects/Organization';
import { Source } from '../coveoObjects/Source';
import { IDiffOptions } from './../commands/DiffCommand';
import { BaseController } from './BaseController';
import { ExtensionController } from './ExtensionController';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { Logger } from '../commons/logger';
import { SourceAPI } from '../commons/rest/SourceAPI';
import { Dictionary } from '../commons/collections/Dictionary';
import { Extension } from '../coveoObjects/Extension';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';

export class SourceController extends BaseController {
  private extensionController: ExtensionController;
  constructor(private organization1: Organization, private organization2: Organization) {
    super();
    this.extensionController = new ExtensionController(this.organization1, this.organization2);
  }

  static CONTROLLER_NAME: string = 'source';

  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Source>> {
    // Load the extensions and the source configuration
    // TODO: do not load the extensions if the user want to skip the extension diff
    Promise.all([this.extensionController.loadExtensionsForBothOrganizations(), this.loadSourcesForBothOrganizations()])
      .then(() => {
        // Here, the extensions should have the same name
        const sources1 = this.organization1.getSources();
        const sources2 = this.organization2.getSources();

        this.replaceExtensionIdWithName(sources1, this.organization1.getExtensions());
        this.replaceExtensionIdWithName(sources2, this.organization2.getExtensions());

        const diffResultArray = DiffUtils.getDiffResult(sources1, sources2, diffOptions);
        if (diffResultArray.containsItems()) {
          // TODO: probably not requierd for the diff, but will be for graduate
          if (diffResultArray.TO_CREATE.length + diffResultArray.TO_DELETE.length > 0) {
            throw new Error(
              'Inconsistent number of extensions between orgs. Run `graduate-extensions` first or use the --skipExtensions option to ignore extensions.'
            );
          }
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated source${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_EXTENTIONS);
        return Promise.reject(err);
      });
    throw new Error('TODO: To implement');
  }

  replaceExtensionIdWithName(sourceList: Dictionary<Source>, extensionList: Dictionary<Extension>) {
    // TODO: Can be optimized
    _.each(sourceList.values(), (source: Source) => {
      // Get all extensions associated to the source
      _.each(source.getPostConversionExtensions(), (sourceExt: IStringMap<string>) => {
        Assert.exists(sourceExt.extensionId, 'Missing extensionId value from extension');
        // For each extension associated to the source, replace its id by its name
        const extensionFound = _.find(extensionList.values(), (extension: Extension) => {
          return extension.getId() === sourceExt.extensionId;
        });

        if (extensionFound) {
          sourceExt.extensionId = extensionFound.getName();
        } else {
          throw new Error('Unable to map extension name to id');
        }
      });

      // Post conversion extensions
      // pre conversion extensions
    });
  }

  replaceNameWithId(sourceList: Dictionary<Source>, extensionList: Dictionary<Extension>) {
    throw new Error('TODO: To implement');
  }

  /**
   *
   * @param {string} organization
   * @returns {Promise<IDownloadResultArray>}
   * @memberof SourceController
   */
  download(organization: string): Promise<IDownloadResultArray> {
    throw new Error('TODO: To implement');
  }

  /**
   * Graduates the sources from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Source>} diffResultArray
   * @param {IHTTPGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  graduate(diffResultArray: DiffResultArray<Source>, options: IHTTPGraduateOptions): Promise<any[]> {
    // this.extensionController.loadExtensionsForBothOrganizations().then(() => {
    // Here, the extensions should have the id of the destination org
    //   // Do graduation stuff
    // });
    // TODO: change the extension name with the destination id
    throw new Error('TODO: To implement');
  }

  extractionMethod(object: any[], oldVersion?: any[]): any[] {
    throw new Error('TODO: To implement');
  }

  loadSourcesForBothOrganizations(): Promise<Array<{}>> {
    Logger.verbose('Loading sources for both organizations.');
    return Promise.all([SourceAPI.loadSources(this.organization1), SourceAPI.loadSources(this.organization2)]);
  }
}
