import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { isUndefined } from 'util';
import { IDiffOptions } from '../commands/DiffCommand';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { FieldAPI } from '../commons/rest/FieldAPI';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { Field } from '../coveoObjects/Field';
import { Organization } from '../coveoObjects/Organization';
import { BaseController } from './BaseController';

export class FieldController extends BaseController {
  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  static CONTROLLER_NAME: string = 'fields';

  private fieldsPerBatch: number = 500;
  private deleteFieldsPerBatch: number = 200;

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
  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Field>> {
    return this.loadFieldForBothOrganizations(this.organization1, this.organization2)

      .then(() => {
        const diffResultArray = DiffUtils.getDiffResult(this.organization1.getFields(), this.organization2.getFields(), diffOptions);
        if (diffResultArray.containsItems()) {
          Logger.verbose('Diff Summary:');
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        } else {
          Logger.info('The field pages are identical in both organizations');
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
        return Promise.reject(err);
      });
  }

  /**
   * Download fields of one org.
   * Provide the name of one of the orgs you specified in creator.
   *
   * @param {string} organization
   * @returns {Promise<IDownloadResultArray>}
   * @memberof FieldController
   */
  download(organization: string): Promise<IDownloadResultArray> {
    const org = _.find([this.organization1, this.organization2], (x: Organization) => {
      return x.getId() === organization;
    });
    // _.find can return Undefined; FieldAPI.loadFields expects
    const foundOrNot = isUndefined(org) ? new Organization('dummy', 'dummy') : org;
    return FieldAPI.loadFields(foundOrNot)
      .then(() => {
        return DownloadUtils.getDownloadResult(foundOrNot.getFields());
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
  graduate(diffResultArray: DiffResultArray<Field>, options: IHTTPGraduateOptions): Promise<any[]> {
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
    return FieldAPI.deleteFields(
      this.organization2,
      _.map(diffResult.TO_DELETE, (field: Field) => field.getName()),
      this.deleteFieldsPerBatch
    )
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'DELETE operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler({ orgId: this.organization2.getId(), message: err } as IGenericError, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
      });
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<Array<{}>> {
    Logger.loadingTask('Loading fields for both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  private extractFieldModel(fields: Field[]): Array<IStringMap<any>> {
    return _.map(fields, (field: Field) => field.getFieldModel());
  }

  extractionMethod(object: any[], oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return _.map(object, (f: Field) => f.getFieldModel());
    } else {
      return _.map(oldVersion, (oldField: Field) => {
        const newField: Field = _.find(object, (f: Field) => {
          return f.getName() === oldField.getName();
        });

        const newFieldModel = newField.getFieldModel();
        const oldFieldModel = oldField.getFieldModel();

        const updatedFieldModel: IStringMap<any> = _.mapObject(newFieldModel, (val, key) => {
          if (!_.isEqual(oldFieldModel[key], val)) {
            return { newValue: val, oldValue: oldFieldModel[key] };
          } else {
            return val;
          }
        });
        return updatedFieldModel;
      });
    }
  }
}
