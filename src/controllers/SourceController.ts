import { RequestResponse } from 'request';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { Source } from '../coveoObjects/Source';
import { UrlService } from '../commons/rest/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../coveoObjects/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { BaseController } from './BaseController';

export class SourceController extends BaseController {

  constructor() {
    super();
  }

  static CONTROLLER_NAME: string = 'sources';
  /*
    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: string[]): Dictionary<IDiffResult<any>> {
      let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
      let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

      try {
        // Load the configuration of the organizations
        let organizations: IOrganization[] = [organization1, organization2];
        let context: SourceController = this;

        organizations.forEach((organization: IOrganization) => {
          context.loadSources(organization);
        });

        // Diff the sources in terms of "existence"
        diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Sources.Clone(), organization2.Sources.Clone());

        // Diff the sources that could have been changed
        diffResultsExistence.UPDATED.Keys().forEach((key: string) => {
          let sourceDiff: IDiffResult<any> = new DiffResult<any>();

          let sourceConfigurationDiff: IDiffResult<any> = DiffUtils.diff(organization1.Sources.Item(key), organization2.Sources.Item(key), fieldsToIgnore);
          sourceDiff = DiffUtils.addToResultIfDiffContainsItems('SourceConfiguration', sourceDiff, sourceConfigurationDiff);

          let mappingDiff: IDiffResult<any> = DiffUtils.diffArrays(
            organization1.Sources.Item(key).Mappings,
            organization2.Sources.Item(key).Mappings,
            fieldsToIgnore,
            false
          );
          sourceDiff = DiffUtils.addToResultIfDiffContainsItems('Mappings', sourceDiff, sourceConfigurationDiff);

          let preConversionDiff: IDiffResult<any> = DiffUtils.diffArrays(
            organization1.Sources.Item(key).PreConversionExtensions,
            organization2.Sources.Item(key).PreConversionExtensions,
            fieldsToIgnore,
            false
          );
          sourceDiff = DiffUtils.addToResultIfDiffContainsItems('PreConversionExtensions', sourceDiff, preConversionDiff);

          let postConversionDiff: IDiffResult<any> = DiffUtils.diffArrays(
            organization1.Sources.Item(key).PostConversionExtensions,
            organization2.Sources.Item(key).PostConversionExtensions,
            fieldsToIgnore,
            false
          );
          sourceDiff = DiffUtils.addToResultIfDiffContainsItems('PreConversionExtensions', sourceDiff, postConversionDiff);

          // Salesforce not really supported as it is "human must do manual stuff" by design
          // So let's just compare the string of the extendedDataFiles and that will be pretty much it
          if (organization1.Sources.Item(key).ExtendedDataFiles !== organization2.Sources.Item(key).ExtendedDataFiles) {
            sourceDiff.NEW.Add(
              'Extended Data Files',
              'Extended Data Files, used by the salesforce source, have changed. You should validate the salesforce source configuration between the 2 organizations.'
            );
          }

          // If the diff contains item, add it to the overall result
          if (sourceDiff.containsItems()) {
            diffResults.Add(key, sourceDiff);
          }

          diffResultsExistence.UPDATED.Remove(key);
        });

        // Add the result if it still contains items
        if (diffResultsExistence.containsItems()) {
          diffResults.Add('ADD_DELETE', diffResultsExistence);
        }
      } catch (err) {
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

    public loadSources(organization: IOrganization): void {
      let sources: any = this.getSources(organization);
      let context = this;
      sources.forEach((source: any) => {
        let newSource: Source = new Source(
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
    }
    */
}
