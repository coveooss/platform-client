import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { UrlService } from '../commons/rest/UrlService';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { DiffResult } from '../commons/collections/DiffResult';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { BaseController } from './BaseController';

export class OrganizationController extends BaseController {
  constructor() {
    super();
  }
/*
  public diff(organization1: IOrganization, organization2: IOrganization, keysToIgnore: string[]): IDiffResult<any> {
    let diffResults: DiffResult<any> = new DiffResult<any>();
    let context: OrganizationController = this;

    try {
      // Load the configuration of the organizations
      let organizations: IOrganization[] = [organization1, organization2];

      organizations.forEach((organization: IOrganization) => {
        context.loadOrganization(organization);
      });

      // Diff the origanizations
      diffResults = DiffUtils.diff(organization1.Configuration, organization2.Configuration, keysToIgnore);
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
  */
}
