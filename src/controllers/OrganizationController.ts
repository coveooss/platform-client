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

export class OrganizationController {
  // Maximum 2 organizations as we will support only support 1 to 1 commands for now.
  private organization1:IOrganization;
  private organization2:IOrganization;
  // Sub controllers
  private sources: SourceController;
  private fields: FieldController;
  private pipelines: PipelineController;

  constructor() { }

  public diff(organization1:IOrganization, organization2:IOrganization, fieldsToIgnore:Array<string>):DiffResult<any> {
    // Load both organization jsons
    Promise.all([
      this.getOrganization(organization1),
      this.getOrganization(organization2)
    ])
    .then((values:any[]) => {
      console.log(values);
      organization1.Configuration = values[0];
      organization2.Configuration = values[1];
    })
    .catch((err: any) => {
        console.log('An error happened while calling the platform: ' + err + err.message);
    });

    // Diff the organizations
    return DiffUtils.diff(organization1.Configuration, organization2.Configuration, fieldsToIgnore);
  }

  private getOrganization(organization:IOrganization):Promise<any> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        UrlService.getOrganizationUrl(organization.Id),
        {
          auth: { 'bearer': organization.ApiKey },
          json: true
        },
        (err: any, response: request.RequestResponse, body: string) => {
          if (err) {
            reject(err);
          } else {
            resolve(body)
          }
      })
    });
  }
}
