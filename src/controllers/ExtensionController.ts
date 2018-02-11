import { IDiffOptions } from './../commands/DiffCommand';
import { Extension } from '../coveoObjects/Extension';
import { Logger } from '../commons/logger';
import { StaticErrorMessage } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { BaseController } from './BaseController';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionAPI } from '../commons/rest/ExtensionAPI';
import { DiffResultArray } from '../commons/collections/DiffResultArray';

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
      .catch((err: any) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_EXTENTIONS);
        return Promise.reject(err);
      });
  }

  // public diff(organization1: IOrganization, organization2: IOrganization, keysToIgnore: string[]): Dictionary<IDiffResult<any>> {
  //   Logger.verbose('Performing a field diff.');
  //   return this.loadExtensionsForBothOrganizations(this.organization1, this.organization2)
  //     .then(() => {
  //     });

  //   let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
  //   let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

  //   try {
  //     // Load the configuration of the organizations
  //     let organizations: IOrganization[] = [organization1, organization2];
  //     let context: ExtensionController = this;

  //     organizations.forEach((organization: IOrganization) => {
  //       context.loadExtensions(organization);
  //     });

  //     // Diff the extensions in terms of "existence"
  //     diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Extensions.Clone(), organization2.Extensions.Clone());

  //     // Diff the extensions that could have been changed
  //     diffResultsExistence.UPDATED.Keys().forEach((key: string) => {
  //       let extensionDiff: IDiffResult<any> = new DiffResult<any>();

  //       // Check the requiredDataStreams
  //       let requiredDataStreamsDiff = DiffUtils.diffArrays(
  //         organization1.Extensions.Item(key).Configuration['requiredDataStreams'],
  //         organization2.Extensions.Item(key).Configuration['requiredDataStreams'],
  //         keysToIgnore
  //       );

  //       if (requiredDataStreamsDiff.NEW.Count() > 0) {
  //         extensionDiff.NEW.Add('Added data streams', requiredDataStreamsDiff.NEW.Values());
  //       }

  //       if (requiredDataStreamsDiff.DELETED.Count() > 0) {
  //         extensionDiff.DELETED.Add('Deleted data streams', requiredDataStreamsDiff.DELETED.Values());
  //       }

  //       // Check the actual extension code
  //       if (organization1.Extensions.Item(key).Configuration['content'] !== organization1.Extensions.Item(key).Configuration['content']) {
  //         extensionDiff.NEW.Add('Extension content (code)', 'Extension content (code) have changed');
  //       }

  //       // If the diff contains item, add it to the overall result
  //       if (extensionDiff.containsItems()) {
  //         diffResults.Add(key, extensionDiff);
  //       }

  //       diffResultsExistence.UPDATED.Remove(key);
  //     });

  //     // Add the result if it still contains items
  //     if (diffResultsExistence.containsItems()) {
  //       diffResults.Add('ADD_DELETE', diffResultsExistence);
  //     }
  //   } catch (err) {
  //     Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

  //     throw err;
  //   }

  //   return diffResults;
  // }

  // public getExtensions(organization: IOrganization): RequestResponse {
  //   return RequestUtils.getRequestAndReturnJson(
  //     UrlService.getExtensionsUrl(organization.Id),
  //     organization.ApiKey
  //   );
  // }

  // public getSingleExtension(organization: IOrganization, extensionId: string, versionId: string): RequestResponse {
  //   return RequestUtils.getRequestAndReturnJson(
  //     UrlService.getSingleExtensionUrl(organization.Id, extensionId, versionId),
  //     organization.ApiKey
  //   );
  // }

  private loadExtensionsForBothOrganizations(organization1: Organization, organization2: Organization): Promise<{}[]> {
    Logger.verbose('Loading extensions for both organizations.');
    return Promise.all([ExtensionAPI.loadExtensions(organization1), ExtensionAPI.loadExtensions(organization2)]);
  }

  // public loadExtensions(organization: IOrganization): void {
  //   let extensions: any = this.getExtensions(organization);
  //   let context = this;
  //   extensions.forEach((extension: any) => {
  //     organization.addExtension(
  //       extension['name'],
  //       new Extension(
  //         extension['id'],
  //         context.getSingleExtension(organization, extension['id'], extension['versionId'])
  //       )
  //     );
  //   });
  // }
}
