import * as request from 'request';
import { IncomingMessage } from 'http'
import { IFieldModel, IFieldResult } from '../commons/interfaces/ifield';
import { UrlService } from '../commons/services/urlService';
import { IOrganizationIdentifier } from '../commons/interfaces/iorganization';

export class FieldController {

  constructor(private organization1: IOrganizationIdentifier, private organization2: IOrganizationIdentifier) {

  }

  public getFields(organization: IOrganizationIdentifier) {
    let url = UrlService.getFieldUrl(organization.id, { page: '2', numberOfResults: '100' });

    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(url, {
        auth: { 'bearer': organization.apiKey },
        json: true
      }, (err: any, response: request.RequestResponse, body: IFieldResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(body)
        }
      })
    });
  }

  public updateFields() {
  }

  public createFields() {
  }

  public deleteFields() {
  }

  public diff(callback) {
    // this.getFields(this.organization1)
    Promise.all([this.getFields(this.organization1), this.getFields(this.organization2)])
      .then(values => {
        console.log('*********************');
        console.log(values);
        console.log('*********************');
        // callback(values)
      })
      .catch((err) => {
        console.log('**Error***');
        console.log(err);

      })
  }

}
