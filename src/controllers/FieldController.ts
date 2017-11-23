import * as _ from 'underscore';
import * as request from 'request';
import * as fs from 'fs-extra';
import { RequestResponse } from 'request';
import { Field } from '../coveoObjects/Field';
import { UrlService } from '../commons/rest/UrlService';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Organization } from '../coveoObjects/Organization';
import { ArrayUtils } from '../commons/utils/ArrayUtils';
import { Assert } from '../commons/misc/Assert';
import { DiffResultArray } from '../coveoObjects/DiffResultArray';
import { FieldAPI } from '../commons/rest/FieldAPI';

export class FieldController {

  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  private fieldsPerBatch: number = 500;

  constructor(private organization1: Organization, private organization2: Organization) { }

  static CONTROLLER_NAME: string = 'fields';

  /**
   * Performs a diff and return the result.
   *
   * @param {string[]} fieldsToIgnore Fields to ignore in the diff. For instance, someone
   * changed the "description" property of the field in the destination org and you don't want the diff to tell you that it has changed.
   * @returns {Promise<DiffResultArray<Field>>}
   */
  public diff(fieldsToIgnore: string[]): Promise<DiffResultArray<Field>> {
    return this.loadFieldForBothOrganizations(this.organization1, this.organization2)
      .then(() => {
        return DiffUtils.getDiffResult(this.organization1.getFields(), this.organization2.getFields());
      });
  }

  /**
   * Performs a diff and graduate the result.
   */
  public graduate() {
    Logger.info('Graduating fields');

    this.diff([])
      .then((diffResultArray: DiffResultArray<Field>) => {
        if (diffResultArray.ContainsItems) {
          this.graduateNew(diffResultArray, this.organization1, this.organization2);
          this.graduateUpdated(diffResultArray, this.organization1, this.organization2);
          this.graduateDeleted(diffResultArray, this.organization1, this.organization2);
        } else {
          Logger.info('No Fields to graduate.');
        }
      }).catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
      });
  }

  private graduateNew(diffResult: DiffResultArray<Field>, organization1: Organization, organization2: Organization) {
    if (diffResult.NEW.length > 0) {
      Logger.verbose(`Creating ${diffResult.NEW.length} new field${diffResult.NEW.length > 1 ? 's' : ''} in ${organization2.getId()} `);
      FieldAPI.createFields(organization2, this.extractFieldModel(diffResult.NEW), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'Create fields response:');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
        });
    }
  }

  private graduateUpdated(diffResult: DiffResultArray<Field>, organization1: Organization, organization2: Organization) {
    if (diffResult.UPDATED.length > 0) {
      Logger.verbose(`Updating ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} in ${organization2.getId()} `);
      FieldAPI.updateFields(organization2, this.extractFieldModel(diffResult.UPDATED), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'Update fields response:');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
        });
    }
  }

  private graduateDeleted(diffResult: DiffResultArray<Field>, organization1: Organization, organization2: Organization) {
    if (diffResult.DELETED.length > 0) {
      Logger.verbose(`Deleting ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} from ${organization2.getId()} `);
      FieldAPI.deleteFields(organization2, _.pluck(diffResult.DELETED, 'name'), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'Update fields response:');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
        });
    }
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization, ): Promise<Array<{}>> {
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
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
    Logger.verbose(`${JSON.stringify(responses)} `);
  }

  private graduateErrorHandler(err: any, errorMessage: string) {
    Logger.error(errorMessage, err);
  }

  // Utils
  private extractFieldModel(fields: Field[]): Array<IStringMap<string>> {
    return _.pluck(fields, 'fieldModel');
  }
}
