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
import { DiffUtils, IDiffOptions } from '../commons/utils/DiffUtils';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Organization } from '../coveoObjects/Organization';
import { ArrayUtils } from '../commons/utils/ArrayUtils';
import { Assert } from '../commons/misc/Assert';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { FieldAPI } from '../commons/rest/FieldAPI';
import { BaseController } from './BaseController';

export class FieldController extends BaseController {

  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  private fieldsPerBatch: number = 500;

  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  static CONTROLLER_NAME: string = 'fields';

  /**
   * Performs a diff and return the result.
   *
   * @param {string[]} keysToIgnore Fields to ignore in the diff. For instance, someone
   * changed the "description" property of the field in the destination org and you don't want the diff to tell you that it has changed.
   * @returns {Promise<DiffResultArray<Field>>}
   */
  public diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Field>> {
    return this.loadFieldForBothOrganizations(this.organization1, this.organization2)
      .then(() => {
        return DiffUtils.getDiffResult(this.organization1.getFields(), this.organization2.getFields(), diffOptions);
      }).catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
        return Promise.reject(err);
      });
  }

  /**
   * Performs a diff and graduate the result.
   */
  public graduate() {

    return this.diff()
      .then((diffResultArray: DiffResultArray<Field>) => {
        if (diffResultArray.containsItems()) {
          Logger.info(`${diffResultArray.NEW.length} new field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);
          Logger.info(`${diffResultArray.DELETED.length} deleted field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);
          Logger.info(`${diffResultArray.UPDATED.length} updated field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);

          Logger.loadingTask('Graduating fields');
          return Promise.all([
            this.graduateNew(diffResultArray),
            this.graduateUpdated(diffResultArray),
            this.graduateDeleted(diffResultArray)
          ]);
        } else {
          Logger.warn('No Fields to graduate');
          return Promise.resolve([]);
        }
      }).catch((err: any) => {
        return Promise.reject(err);
      });
  }

  private graduateNew(diffResult: DiffResultArray<Field>): Promise<void> | undefined {
    if (diffResult.NEW.length > 0) {
      Logger.verbose(`Creating ${diffResult.NEW.length} new field${diffResult.NEW.length > 1 ? 's' : ''} in ${this.organization2.getId()} `);
      return FieldAPI.createFields(this.organization2, this.extractFieldModel(diffResult.NEW), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'POST operation successfully completed');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
        });
    }
  }

  private graduateUpdated(diffResult: DiffResultArray<Field>): Promise<void> | undefined {
    if (diffResult.UPDATED.length > 0) {
      Logger.verbose(`Updating ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} in ${this.organization2.getId()} `);
      return FieldAPI.updateFields(this.organization2, this.extractFieldModel(diffResult.UPDATED), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'PUT operation successfully completed');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
        });
    }
  }

  private graduateDeleted(diffResult: DiffResultArray<Field>): Promise<void> | undefined {
    if (diffResult.DELETED.length > 0) {
      Logger.verbose(`Deleting ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} from ${this.organization2.getId()} `);
      return FieldAPI.deleteFields(this.organization2, _.pluck(diffResult.DELETED, 'name'), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          this.graduateSuccessHandler(responses, 'DELETE operation successfully completed');
        }).catch((err: any) => {
          this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
        });
    }
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<Array<{}>> {
    Logger.loadingTask('Loading fields for both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  // Utils
  private extractFieldModel(fields: Field[]): Array<IStringMap<string>> {
    return _.pluck(fields, 'fieldModel');
  }
}
