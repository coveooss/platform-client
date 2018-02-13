import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { Field } from '../coveoObjects/Field';
import { Logger } from '../commons/logger';
import { StaticErrorMessage, IGenericError } from '../commons/errors';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Organization } from '../coveoObjects/Organization';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { FieldAPI } from '../commons/rest/FieldAPI';
import { BaseController } from './BaseController';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
import { IDiffOptions } from '../commands/DiffCommand';
import { Colors } from '../commons/colors';

export class FieldController extends BaseController {
  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  static CONTROLLER_NAME: string = 'fields';

  private fieldsPerBatch: number = 500;

  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

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
        const diffResultArray = DiffUtils.getDiffResult(this.organization1.getFields(), this.organization2.getFields(), diffOptions);
        if (diffResultArray.containsItems()) {
          Logger.verbose('Diff Summary:');
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        } else {
          Logger.info('They field pages are identical in both organizations');
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
        return Promise.reject(err);
      });
  }

  /**
   * Graduates the fields from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Field>} diffResultArray
   * @param {IHTTPGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  public graduate(diffResultArray: DiffResultArray<Field>, options: IHTTPGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating fields');
      return Promise.all(
        _.map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<Field>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No Fields to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new field${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${Colors.organization(
        this.organization2.getId()
      )} `
    );
    return FieldAPI.createFields(this.organization2, this.extractFieldModel(diffResult.TO_CREATE), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'POST operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler({ orgId: this.organization2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
      });
  }

  private graduateUpdated(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing field${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );
    return FieldAPI.updateFields(this.organization2, this.extractFieldModel(diffResult.TO_UPDATE), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'PUT operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler({ orgId: this.organization2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
      });
  }

  private graduateDeleted(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing field${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    return FieldAPI.deleteFields(this.organization2, _.map(diffResult.TO_DELETE, (field: Field) => field.getName()), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'DELETE operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler({ orgId: this.organization2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
      });
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<{}[]> {
    Logger.loadingTask('Loading fields for both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  private extractFieldModel(fields: Field[]): IStringMap<any>[] {
    return _.map(fields, (field: Field) => field.getFieldModel());
  }
}
