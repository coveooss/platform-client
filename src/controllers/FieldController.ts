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

export interface IDiffResultArrayClean {
  summary: {
    TO_CREATE: number;
    TO_UPDATE: number;
    TO_DELETE: number;
  };
  TO_CREATE: IStringMap<string>;
  TO_UPDATE: IStringMap<string>;
  TO_DELETE: IStringMap<string>;
}

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
   * Return a simplified diff object.
   * This function makes it easier to get a section of the diff result and use it in a API call.
   *
   * @param {DiffResultArray<Field>} diffResultArray
   * @returns {IStringMap<any>}
   */
  public getCleanVersion(diffResultArray: DiffResultArray<Field>, summary: boolean = true): IDiffResultArrayClean {
    const getFieldModel = (fields: Field[]) => _.map(fields, (f: Field) => f.getFieldModel());
    const cleanVersion: IStringMap<any> = {};

    if (summary) {
      cleanVersion.summary = {
        TO_CREATE: diffResultArray.TO_CREATE.length,
        TO_UPDATE: diffResultArray.TO_UPDATE.length,
        TO_DELETE: diffResultArray.TO_DELETE.length
      };
    }

    _.extend(cleanVersion, {
      TO_CREATE: getFieldModel(diffResultArray.TO_CREATE),
      TO_UPDATE: getFieldModel(diffResultArray.TO_UPDATE),
      TO_DELETE: getFieldModel(diffResultArray.TO_DELETE)
    });

    return cleanVersion as IDiffResultArrayClean;
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
          Logger.verbose(`> ${diffResultArray.TO_CREATE.length} new field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`> ${diffResultArray.TO_DELETE.length} deleted field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`> ${diffResultArray.TO_UPDATE.length} updated field${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
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
   * Performs a diff and graduate the result.
   */
  public graduate(diffResultArray: DiffResultArray<Field>, options: IHTTPGraduateOptions) {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating fields');
      return Promise.all(
        _.map(
          this.getAuthorizedOperations(diffResultArray, options),
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

  private getAuthorizedOperations(
    diffResultArray: DiffResultArray<Field>,
    options: IHTTPGraduateOptions
  ): ((diffResult: DiffResultArray<Field>) => Promise<void>)[] {
    const authorizedOperations: ((diffResult: DiffResultArray<Field>) => Promise<void>)[] = [];
    if (options.POST && diffResultArray.TO_CREATE.length > 0) {
      authorizedOperations.push(this.graduateNew);
    } else {
      Logger.verbose('Skipping DELETE operation');
    }
    if (options.PUT && diffResultArray.TO_UPDATE.length > 0) {
      authorizedOperations.push(this.graduateUpdated);
    } else {
      Logger.verbose('Skipping PUT operation');
    }
    if (options.DELETE && diffResultArray.TO_DELETE.length > 0) {
      authorizedOperations.push(this.graduateDeleted);
    } else {
      Logger.verbose('Skipping DELETE operation');
    }
    if (authorizedOperations.length === 0) {
      Logger.verbose('No HTTP mothod was selected for the graduation');
    }

    return authorizedOperations;
  }

  private graduateNew(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new field${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    return FieldAPI.createFields(this.organization2, this.extractFieldModel(diffResult.TO_CREATE), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'POST operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
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
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
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
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
      });
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<{}[]> {
    Logger.loadingTask('Loading fields for both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  // Utils
  private extractFieldModel(fields: Field[]): IStringMap<any>[] {
    return _.pluck(fields, 'fieldModel');
  }
}
