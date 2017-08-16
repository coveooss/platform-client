// External packages
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
  // Maximum 2 organizations as we will support only support 1 to 1 commands for now.
  private organization1: IOrganization;
  private organization2: IOrganization;
  // Sub controllers
  private sources: SourceController;
  private fields: FieldController;
  private pipelines: PipelineController;

  constructor() { }

  public async diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>) {
    // Diff the organizations
    let error: { organization: string, response: any }[] = [];
    try {

      let organizations = [organization1, organization2];

      let org1Response: request.RequestResponse = await this.getOrganization(organization1);
      let org2Response: request.RequestResponse = await this.getOrganization(organization2);

      _.each([org1Response, org2Response], (response: request.RequestResponse, idx: number) => {
        if (response.statusCode !== 200) {
          // TODO: need to make a better response in the console
          error.push({
            organization: organizations[idx].Id,
            response: response.body
          });
        }
      });

      if (error.length > 0) {
        throw new Error(JSON.stringify(error));
      }

      return DiffUtils.diff(org1Response.body, org2Response.body, fieldsToIgnore);
    } catch (err) {
      Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
    }
  }

  private getOrganization(organization: IOrganization): Promise<any> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        UrlService.getOrganizationUrl(organization.Id),
        {
          auth: { 'bearer': organization.ApiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(response)
          }
        })
    });
  }
}
