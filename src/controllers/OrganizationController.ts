// External packages
var syncrequest = require('sync-request');
import * as request from 'request';
// Internal packages
import { IOrganization } from '../commons/interfaces/IOrganization';
import { SourceController } from './SourceController';
import { FieldController } from './FieldController';
import { PipelineController } from './PipelineController';
import { UrlService } from '../commons/services/UrlService';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { DiffResult } from '../models/DiffResult';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { StaticErrorMessage } from '../commons/errors';
import * as _ from 'underscore';
import * as chalk from 'chalk';
import { Logger } from '../commons/logger';

export class OrganizationController {
  constructor() { }

  public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): IDiffResult<any> {
    let diffResults: DiffResult<any> = new DiffResult<any>();
    
    let error: { organization: string, response: any }[] = [];

    try {
      // Load the configuration of the organizations
      let organizations:Array<IOrganization> = [organization1, organization2];

      organizations.forEach(organization => {
        var response:any = this.getOrganization(organization);
        if (response.statusCode == 200) { 
          organization.Configuration = JSON.parse(response.getBody('utf-8'));
        } else {
          // TODO: need to make a better response in the console
          error.push({
            organization: organization.Id,
            response: JSON.parse(response.getBody('utf-8'))
          });
        }
      });

      if (error.length > 0) {
        throw new Error(JSON.stringify(error));
      }

      // Diff the origanizations
      diffResults = DiffUtils.diff(organization1.Configuration, organization2.Configuration, fieldsToIgnore);
    } catch (err) {
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
    }

    return diffResults;
  }

  public getOrganization(organization: IOrganization): request.RequestResponse {
    var response = syncrequest(
      'GET',
      UrlService.getOrganizationUrl(organization.Id),
      {
        'headers': {
          'authorization': 'Bearer ' + organization.ApiKey
        }
      }
    );

    return response;
  }
}
