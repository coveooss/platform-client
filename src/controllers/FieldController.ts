import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { Field } from '../coveoObjects/Field';
import { Logger } from '../commons/logger';
import { StaticErrorMessage } from '../commons/errors';
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
    NEW: number;
    UPDATED: number;
    DELETED: number;
  };
  NEW: IStringMap<string>;
  UPDATED: IStringMap<string>;
  DELETED: IStringMap<string>;
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
        NEW: diffResultArray.NEW.length,
        UPDATED: diffResultArray.UPDATED.length,
        DELETED: diffResultArray.DELETED.length
      };
    }

    _.extend(cleanVersion, {
      NEW: getFieldModel(diffResultArray.NEW),
      UPDATED: getFieldModel(diffResultArray.UPDATED),
      DELETED: getFieldModel(diffResultArray.DELETED)
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
          Logger.verbose(`> ${diffResultArray.NEW.length} new field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);
          Logger.verbose(`> ${diffResultArray.DELETED.length} deleted field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);
          Logger.verbose(`> ${diffResultArray.UPDATED.length} updated field${diffResultArray.NEW.length > 1 ? 's' : ''} found`);
        } else {
          Logger.info('They field pages are identical in both organizations');
        }
        return diffResultArray;
      })
      .catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
        return Promise.reject(err);
      });
  }

  /**
   * Performs a diff and graduate the result.
   */
  public graduate(options: IHTTPGraduateOptions) {
    return this.diff()
      .then((diffResultArray: DiffResultArray<Field>) => {
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
      })
      .catch((err: any) => {
        return Promise.reject(err);
      });
  }

  private getAuthorizedOperations(
    diffResultArray: DiffResultArray<Field>,
    options: IHTTPGraduateOptions
  ): ((diffResult: DiffResultArray<Field>) => Promise<void>)[] {
    const authorizedOperations: ((diffResult: DiffResultArray<Field>) => Promise<void>)[] = [];
    if (options.POST && diffResultArray.NEW.length > 0) {
      authorizedOperations.push(this.graduateNew);
    } else {
      Logger.verbose('Skipping DELETE operation');
    }
    if (options.PUT && diffResultArray.UPDATED.length > 0) {
      authorizedOperations.push(this.graduateUpdated);
    } else {
      Logger.verbose('Skipping PUT operation');
    }
    if (options.DELETE && diffResultArray.DELETED.length > 0) {
      authorizedOperations.push(this.graduateDeleted);
    } else {
      Logger.verbose('Skipping DELETE operation');
    }
    if (authorizedOperations.length === 0) {
      Logger.verbose('No HTTP mothod was selected for the graduation');
    }

    return authorizedOperations;
  }

  // TODO: to test
  private graduateNew(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(`Creating ${diffResult.NEW.length} new field${diffResult.NEW.length > 1 ? 's' : ''} in ${this.organization2.getId()} `);
    return FieldAPI.createFields(this.organization2, this.extractFieldModel(diffResult.NEW), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.graduateSuccessHandler(responses, 'POST operation successfully completed');
      })
      .catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_CREATE_FIELDS);
      });
  }

  // TODO: to test
  private graduateUpdated(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Updating ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} in ${this.organization2.getId()} `
    );
    return FieldAPI.updateFields(this.organization2, this.extractFieldModel(diffResult.UPDATED), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.graduateSuccessHandler(responses, 'PUT operation successfully completed');
      })
      .catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS);
      });
  }

  // TODO: to test: make sure the query is well formed (with the list of fields to delete)
  private graduateDeleted(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Deleting ${diffResult.UPDATED.length} existing field${diffResult.NEW.length > 1 ? 's' : ''} from ${this.organization2.getId()} `
    );
    return FieldAPI.deleteFields(this.organization2, _.map(diffResult.DELETED, (field: Field) => field.getName()), this.fieldsPerBatch)
      .then((responses: RequestResponse[]) => {
        this.graduateSuccessHandler(responses, 'DELETE operation successfully completed');
      })
      .catch((err: any) => {
        this.graduateErrorHandler(err, StaticErrorMessage.UNABLE_TO_DELETE_FIELDS);
      });
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<{}[]> {
    Logger.loadingTask('Loading fields for both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  // Utils
  private extractFieldModel(fields: Field[]): IStringMap<string>[] {
    return _.pluck(fields, 'fieldModel');
  }
}
