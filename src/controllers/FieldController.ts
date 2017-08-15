// External Packages
import * as request from 'request';
import { IncomingMessage } from 'http'
import * as _ from 'underscore';
// Internal packages
import { IField, IFieldResult } from '../commons/interfaces/IField';
import { UrlService } from '../commons/services/UrlService';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { IDiff } from '../commons/interfaces/IDiff';

export class FieldController {

  constructor(private organization1: IOrganization, private organization2: IOrganization) {

  }

  public getFields(organization: IOrganization) {
    let url = UrlService.getFieldUrl(organization.Id, { page: '2', numberOfResults: '100' });

    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(url, {
        auth: { 'bearer': organization.ApiKey },
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

  private partitionFieldSet(firstFieldSet: IField[], secondFieldSet: IField[]): any {
    // private partitionFieldSet(): IDiff<IFieldModel> {
    let deletedFields = [];
    let newFields = []
    let updatedFields = []

    console.log('--------------');
    console.log(firstFieldSet);
    console.log('--------------');
    console.log(secondFieldSet);
    console.log('--------------');

    let same = _.foldl(firstFieldSet, (current: IField[], x: IField) => {
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
