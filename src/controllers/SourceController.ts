// External packages
var syncrequest = require('sync-request');
import * as request from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
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
      let organizations:Array<IOrganization> = [organization1, organization2];
      let context:SourceController = this;

      organizations.forEach(organization => {
        let sources:any = this.getSources(organization);
          sources.forEach(function (source:any) {
            let jsonResponse:any = context.getSingleSourceRaw(organization, source['id']);
            // DiffUtils.diffArrays(jsonResponse['mappings']);
            // Differ l'array ou juste le "normaliser" en le flattenisant? Pourrait fonctionner aussi pour les extensions si on récupère le nom

            organization.Sources.Add(
              source['name'],
              // TODO: remove and diff the mappings
              // TODO: remove and diff the extensions
              // TODO: remove and diff the objects to get
              // TODO: Like, remove configuration.extendedDataFiles.ObjectsToGet
              JsonUtils.removeFieldsFromJson(
                jsonResponse, 
                ['mappings', 'preConversionExtensions', 'postConversionExtensions']
              )
            );
          });
      });

      // Diff the sources in terms of "existence"
      diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Sources.Clone(), organization2.Sources.Clone());
      diffResults.Add('ADD_DELETE', diffResultsExistence);
      // Diff the sources that could have been changed
      diffResultsExistence.UPDATED_NEW.Keys().forEach(function (key) {
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
    }

    return diffResults;
  }

  public getSources(organization: IOrganization): request.RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getSourcesUrl(organization.Id),
      organization.ApiKey
    );
  }

  public getSingleSourceRaw(organization: IOrganization, sourceId:string): request.RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getSingleSourceRawUrl(organization.Id, sourceId),
      organization.ApiKey
    );
  }
}
