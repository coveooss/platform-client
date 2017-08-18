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
import { RequestUtils } from '../commons/utils/RequestUtils';
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

    try {
      // Load the configuration of the organizations
      let organizations:Array<IOrganization> = [organization1, organization2];

      organizations.forEach(organization => {
        organization.Configuration = this.getOrganization(organization);
      });

      // Diff the origanizations
      diffResults = DiffUtils.diff(organization1.Configuration, organization2.Configuration, fieldsToIgnore);
    } catch (err) {
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
    }

    return diffResults;
  }

  public getOrganization(organization: IOrganization): request.RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getOrganizationUrl(organization.Id),
      organization.ApiKey
    );
  }
}
