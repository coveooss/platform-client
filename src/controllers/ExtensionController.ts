// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { Extension } from '../models/ExtensionModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class ExtensionController {
  public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
    let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

    try {
      // Load the configuration of the organizations
      let organizations: Array<IOrganization> = [organization1, organization2];
      let context: ExtensionController = this;

      organizations.forEach(function (organization: IOrganization) {
        context.loadExtensions(organization);
      });

      // Diff the extensions in terms of "existence"
      diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Extensions.Clone(), organization2.Extensions.Clone());

      // Diff the extensions that could have been changed
      diffResultsExistence.UPDATED.Keys().forEach(function (key: string) {
        let extensionDiff: IDiffResult<any>  = new DiffResult<any>();

        // Check the requiredDataStreams
        let requiredDataStreamsDiff = DiffUtils.diffArrays(
            organization1.Extensions.Item(key).Configuration['requiredDataStreams'],
            organization2.Extensions.Item(key).Configuration['requiredDataStreams'],
            fieldsToIgnore
        )

        if (requiredDataStreamsDiff.NEW.Count() > 0) {
            extensionDiff.NEW.Add('Added data streams', requiredDataStreamsDiff.NEW.Values());
        }

        if (requiredDataStreamsDiff.DELETED.Count() > 0) {
            extensionDiff.DELETED.Add('Deleted data streams', requiredDataStreamsDiff.DELETED.Values());
        }

        // Check the actual extension code
        if (organization1.Extensions.Item(key).Configuration['content'] !== organization1.Extensions.Item(key).Configuration['content']) {
            extensionDiff.NEW.Add('Extension content (code)', 'Extension content (code) have changed');
        }

        // If the diff contains item, add it to the overall result
        if (extensionDiff.ContainsItems()) {
          diffResults.Add(key, extensionDiff);
        }

        diffResultsExistence.UPDATED.Remove(key);
      });

      // Add the result if it still contains items
      if (diffResultsExistence.ContainsItems()) {
          diffResults.Add('ADD_DELETE', diffResultsExistence);
      }
    } catch (err) {
      // TODO: Move the loogers from all files to their base classes when possible
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

      throw err;
    }

    return diffResults;
  }

  public getExtensions(organization: IOrganization): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getExtensionsUrl(organization.Id),
      organization.ApiKey
    );
  }

  public getSingleExtension(organization: IOrganization, extensionId: string, versionId: string): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getSingleExtensionUrl(organization.Id, extensionId, versionId),
      organization.ApiKey
    );
  }

  public loadExtensions(organization: IOrganization): void {
      let extensions: any = this.getExtensions(organization);
      let context = this;
      extensions.forEach(function (extension: any) {
        organization.Extensions.Add(
          extension['name'],
          new Extension(
            extension['id'],
            context.getSingleExtension(organization, extension['id'], extension['versionId'])
          )
        );
      });
  }
}
