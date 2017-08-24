// External packages
import { RequestResponse } from 'request';
// Internal packages
import { IOrganization } from '../commons/interfaces/IOrganization';
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
    let context: OrganizationController = this;

    try {
      // Load the configuration of the organizations
      let organizations: Array<IOrganization> = [organization1, organization2];

      organizations.forEach(function (organization: IOrganization) {
        context.loadOrganization(organization);
      });

      // Diff the origanizations
      diffResults = DiffUtils.diff(organization1.Configuration, organization2.Configuration, fieldsToIgnore);
    } catch (err) {
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
      throw err;
    }

    return diffResults;
  }

  public getOrganization(organization: IOrganization): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getOrganizationUrl(organization.Id),
      organization.ApiKey
    );
  }

  public loadOrganization(organization: IOrganization): void {
    organization.Configuration = this.getOrganization(organization);
  }
}
