import * as request from 'request';
import { IncomingMessage } from 'http'
import { IFieldModel, IFieldResult } from '../commons/interfaces/ifield';
import { UrlService } from '../commons/services/urlService';
import { IOrganizationIdentifier } from '../commons/interfaces/iorganization';
import { IDiff } from '../commons/interfaces/Idiff';
import * as _ from 'underscore';

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

  private partitionFieldSet(firstFieldSet: IFieldModel[], secondFieldSet: IFieldModel[]): any {
    // private partitionFieldSet(): IDiff<IFieldModel> {
    let deletedFields = [];
    let newFields = []
    let updatedFields = []

    console.log('--------------');
    console.log(firstFieldSet);
    console.log('--------------');
    console.log(secondFieldSet);
    console.log('--------------');

    let same = _.foldl(firstFieldSet, (current: IFieldModel[], x: IFieldModel) => {
      let ready = _.matcher(x);
      return current.concat(_.filter(secondFieldSet, ready));
    }, [])

    return same;
  }

  public diff(callback) {
    // this.getFields(this.organization1)
    Promise.all([this.getFields(this.organization1), this.getFields(this.organization2)])
      .then((values: IFieldResult[]) => {
        console.log('*********************');
        // console.log(values[0].totalEntries);
        console.log(this.partitionFieldSet(values[0].items, values[1].items));
        console.log('*********************');
        // callback(values)
      })
      .catch((err: any) => {
        console.log(err);

      })
  }

}
