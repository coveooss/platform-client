import { RequestResponse } from 'request';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Field } from '../models/FieldModel';
import { UrlService } from '../commons/services/UrlService';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Organization } from '../models/OrganizationModel';
import { ArrayUtils } from '../commons/utils/ArrayUtils';
import { Assert } from '../commons/misc/Assert';
import { FileUtils } from '../commons/utils/FileUtils';
import * as _ from 'underscore';
import * as request from 'request';
import * as fs from 'fs-extra';
import { DiffResultArray } from '../models/DiffResultArray';

export class FieldController {

  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  private fieldsPerBatch: number = 500;

  constructor() { }

  /**
   * Perform a diff and return the result that will be used for the graduate command
   *
   * @param {Organization} organization1 Origin Organisation
   * @param {Organization} organization2 Final Organisation
   * @returns {IDiffResult<string>} The Diff result
   * @memberof FieldController
   */
  public graduate(organization1: Organization, organization2: Organization) {
    Logger.info('Graduating fields');

    Promise.all([this.loadFields(organization1), this.loadFields(organization2)])
      // ********************************************
      // TODO: Ask confirmation to graduate
      // ********************************************
      .then(() => {
        let diffResult = DiffUtils.getDiffResult(organization1.Fields, organization2.Fields);

        if (diffResult.NEW.length > 0) {
          Logger.verbose(`Creating ${diffResult.NEW.length} new field${diffResult.NEW.length > 1 ? 's' : ''} in ${organization2.Id}`);
          this.createFields(organization2, this.getFieldModels(diffResult.NEW))
            .then((responses: RequestResponse[]) => {
              this.graduateSuccessHandler(responses, 'Create fields response:');
            }).catch((err: any) => {
              this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
            });
        }

        if (diffResult.UPDATED.length > 0) {
          Logger.verbose(`Updating ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} in ${organization2.Id}`);
          this.updateFields(organization2, this.getFieldModels(diffResult.UPDATED))
            .then((responses: RequestResponse[]) => {
              this.graduateSuccessHandler(responses, 'Update fields response:');
            }).catch((err: any) => {
              this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
            });
        }

        if (diffResult.DELETED.length > 0) {
          Logger.verbose(`Deleting ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} from ${organization2.Id}`);
          this.deleteFields(organization2, _.pluck(diffResult.DELETED, 'name'))
            .then((responses: RequestResponse[]) => {
              this.graduateSuccessHandler(responses, 'Update fields response:');
            }).catch((err: any) => {
              this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
            });
        }

      }).catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
      });

    // return response and summary
  }

  public createFields(org: Organization, fieldModels: Array<IStringMap<string>>) {
    Assert.isLargerThan(0, fieldModels.length);
    Logger.verbose(`Creating ${fieldModels.length} fields from ${org.Id}`);
    let url = UrlService.createFields(org.Id);
    return Promise.all(_.map(ArrayUtils.chunkArray(fieldModels, this.fieldsPerBatch), (batch: Array<IStringMap<string>>) => {
      return RequestUtils.post(url, org.ApiKey, batch);
    }));
  }

  public updateFields(org: Organization, fieldModels: Array<IStringMap<string>>) {
    Assert.isLargerThan(0, fieldModels.length);
    Logger.verbose(`Updating ${fieldModels.length} fields from ${org.Id}`);
    let url = UrlService.updateFields(org.Id);
    return Promise.all(_.map(ArrayUtils.chunkArray(fieldModels, this.fieldsPerBatch), (batch: Array<IStringMap<string>>) => {
      return RequestUtils.put(url, org.ApiKey, batch);
    }));
  }

  public deleteFields(org: Organization, fieldList: string[]) {
    Assert.isLargerThan(0, fieldList.length);
    Logger.verbose(`Deleting ${fieldList.length} fields from ${org.Id}`);
    return Promise.all(_.map(ArrayUtils.chunkArray(fieldList, this.fieldsPerBatch), (batch: string[]) => {
      let url = UrlService.deleteFields(org.Id, batch);
      return RequestUtils.delete(url, org.ApiKey);
    }));
  }

  public getFieldModels(fields: Field[]): Array<IStringMap<string>> {
    return _.pluck(fields, 'fieldModel');
  }

  public diff(organization1: Organization, organization2: Organization, fieldsToIgnore: string[]): Promise<DiffResultArray<Field>> {
    return Promise.all([this.loadFields(organization1), this.loadFields(organization2)])
      .then(() => {
        return DiffUtils.getDiffResult(organization1.Fields, organization2.Fields);
      });
  }

  public getFieldsPage(organization: Organization, page: number): Promise<RequestResponse> {
    Logger.verbose(`Fecthing field page ${page} from ${organization.Id}`);
    return RequestUtils.get(
      UrlService.getFieldsPageUrl(organization.Id, page),
      organization.ApiKey
    );
  }

  public loadFields(organization: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {

      this.getFieldsPage(organization, 0)
        .then((response: RequestResponse) => {
          this.addLoadedFieldsToOrganization(organization, response.body.items);

          if (response.body.totalPages > 1) {
            this.loadOtherPages(organization, response.body.totalPages)
              .then(() => resolve())
              .catch((err: any) => {
                reject(err);
              });
          } else {
            resolve();
          }

        }).catch((err: any) => {
          reject(err);
        });
    });
  }

  public loadOtherPages(organization: Organization, totalPages: number): Promise<void> {
    Logger.verbose(`Loading ${totalPages - 1} more pages of fields from ${organization.Id}`);
    let pageArray = _.map(new Array(totalPages - 1), (v: number, idx: number) => idx + 1);
    return Promise
      .all(_.map(pageArray, (page: number) => this.getFieldsPage(organization, page)))
      .then((otherPages: RequestResponse[]) => {
        _.each(otherPages, (response: RequestResponse) => {
          this.addLoadedFieldsToOrganization(organization, response.body.items);
        });
      });
  }

  public addLoadedFieldsToOrganization(organization: Organization, fields: Array<IStringMap<string>>) {
    fields.forEach((f: IStringMap<string>) => {
      let field = new Field(f);
      organization.Fields.Add(field.name, field);
    });
  }

  private graduateSuccessHandler(responses: RequestResponse[], successMessage: string) {
    Logger.info(successMessage);
    _.each(responses, (response: RequestResponse) => {
      let info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        info.statusMessage = response.statusMessage;
      }
      Logger.info(JSON.stringify(info));
    });
    Logger.verbose(`${JSON.stringify(responses)}`);
  }

  private graduateErrorHandler(err: any, errorMessage: string) {
    Logger.error(errorMessage, err);
  }
}
