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

export class SourceController {
  constructor() { }

  public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
    let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

    try {
      // Load the configuration of the organizations
      let organizations:Array<IOrganization> = [organization1, organization2];
      let error: { organization: string, response: any }[] = [];
      let context:SourceController = this;

      organizations.forEach(organization => {
        let response:any = this.getSources(organization);
        if (response.statusCode == 200) { 
          let sources = JSON.parse(response.getBody('utf-8'));

          sources.forEach(function (source:any) {
            let sourceRawResponse:any = context.getSingleSourceRaw(organization, source['id']);

            if (sourceRawResponse.statusCode == 200) { 
              organization.Sources.Add(
                source['name'],
                // TODO: remove and diff the mappings
                // TODO: remove and diff the extensions
                // TODO: remove and diff the objects to get
                // TODO: Like, remove configuration.extendedDataFiles.ObjectsToGet
                JsonUtils.removeFieldsFromJson(
                  JSON.parse(sourceRawResponse.getBody('utf-8')), 
                  ['mappings', 'preConversionExtensions', 'postConversionExtensions']
                )
              );
            } else {
              // TODO: need to make a better response in the console
              error.push({
                organization: organization.Id,
                response: JSON.parse(response.getBody('utf-8'))
              });
            }
          })
        } else {
          // TODO: need to make a better response in the console
          error.push({
            organization: organization.Id,
            response: JSON.parse(response.getBody('utf-8'))
          });
        }
      });


      // Diff the sources in terms of "existence"
      diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Sources.Clone(), organization2.Sources.Clone());
      diffResults.Add('ADD_DELETE', diffResultsExistence);
      // Diff the sources that could have been changed
      diffResultsExistence.UPDATED_NEW.Keys().forEach(function (key) {
        let sourceDiff: DiffResult<any> = context.diffSingleSource(organization1, organization2, key, fieldsToIgnore);
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

  public diffSingleSource(organization1: IOrganization, organization2: IOrganization, sourceName: string, fieldsToIgnore: Array<string>): DiffResult<any> {
  let diffResult: DiffResult<any> = DiffUtils.diff(organization1.Sources.Item(sourceName), organization2.Sources.Item(sourceName), fieldsToIgnore);

    return diffResult;
  }

  public getSources(organization: IOrganization): request.RequestResponse {

    var response = syncrequest(
      'GET',
      UrlService.getSourcesUrl(organization.Id),
      {
        'headers': {
          'authorization': 'Bearer ' + organization.ApiKey
        }
      }
    );

    return response;
  }

  public getSingleSourceRaw(organization: IOrganization, sourceId:string): request.RequestResponse {

    var response = syncrequest(
      'GET',
      UrlService.getSingleSourceRawUrl(organization.Id, sourceId),
      {
        'headers': {
          'authorization': 'Bearer ' + organization.ApiKey
        }
      }
    );

    return response;
  }
}
