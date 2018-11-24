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
          if (diffResultArray.TO_CREATE.length) {
            throw new Error(
              'Missing extensions in destination org. Run `graduate-extensions` first or use the --skipExtensions option to ignore extensions.'
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
    throw new Error('TODO: To implement');
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
