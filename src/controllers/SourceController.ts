// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { ISource } from '../commons/interfaces/ISource'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { Source } from '../models/SourceModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class SourceController {
  constructor() { }

  public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
    let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

    try {
      // Load the configuration of the organizations
      let organizations: Array<IOrganization> = [organization1, organization2];
      let context: SourceController = this;

      organizations.forEach(function (organization: IOrganization) {
        let sources: any = context.getSources(organization);
        sources.forEach(function (source: any) {
          let newSource: ISource = new Source(
            source['id'],
            context.getSingleSourceRaw(organization, source['id'])
          );

          newSource.Mappings = newSource.Configuration['mappings'];
          delete newSource.Configuration['mappings'];
          newSource.PreConversionExtensions = newSource.Configuration['preConversionExtensions'];
          delete newSource.Configuration['preConversionExtensions'];
          newSource.PostConversionExtensions = newSource.Configuration['postConversionExtensions'];
          delete newSource.Configuration['postConversionExtensions'];
          newSource.ExtendedDataFiles = newSource.Configuration['configuration']['extendedDataFiles'];
          delete newSource.Configuration['configuration']['extendedDataFiles'];

          organization.Sources.Add(
            source['name'],
            newSource
          );
        });
      });

      let test: IDiffResult<any> = DiffUtils.diffArrays(organization1.Sources.Values()[0].Mappings, organization1.Sources.Values()[0].Mappings, fieldsToIgnore, true);
      // TODO: diff the mappings
      // TODO: diff the extensions
      // TODO: diff the objects to get
      // TODO: Like, remove configuration.extendedDataFiles.ObjectsToGet

      // Diff the sources in terms of "existence"
      diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Sources.Clone(), organization2.Sources.Clone());
      diffResults.Add('ADD_DELETE', diffResultsExistence);

      // Diff the sources that could have been changed
      diffResultsExistence.UPDATED_NEW.Keys().forEach(function (key: string) {
        let sourceDiff: DiffResult<any> = DiffUtils.diff(organization1.Sources.Item(key), organization2.Sources.Item(key), fieldsToIgnore);
        if (sourceDiff.ContainsItems()) {
          diffResults.Add(
            key,
            sourceDiff
          )
        }
        diffResultsExistence.UPDATED_NEW.Remove(key);
      });
    } catch (err) {
      // TODO: Move the loogers from all files to their base classes when possible
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

      throw err;
    }

    return diffResults;
  }

  public getSources(organization: IOrganization): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getSourcesUrl(organization.Id),
      organization.ApiKey
    );
  }

  public getSingleSourceRaw(organization: IOrganization, sourceId: string): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getSingleSourceRawUrl(organization.Id, sourceId),
      organization.ApiKey
    );
  }
}
