import { RequestResponse } from 'request';
import { BaseController } from './BaseController';
import { each, find, isEqual, map, mapObject, pluck, union } from 'underscore';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { FieldAPI } from '../commons/rest/FieldAPI';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { Field } from '../coveoObjects/Field';
import { Organization } from '../coveoObjects/Organization';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { Dictionary } from '../commons/collections/Dictionary';

export class FieldController extends BaseController {
  private fieldsPerBatch: number = 500;
  private deleteFieldsPerBatch: number = 200;
  objectName = 'fields';

  // The second organization can be optional in some cases like the download command for instance.
  constructor(private organization1: Organization, private organization2: Organization = new Organization('', '')) {
    super();
  }

  /**
   * Load fields from both organizations and then performs a diff.
   *
   * @param {string[]} keysToIgnore Fields to ignore in the diff. For instance, someone
   * changed the "description" property of the field in the destination org and you don't want the diff to tell you that it has changed.
   * @returns {Promise<DiffResultArray<Field>>}
   */
  runDiffSequence(diffOptions?: IDiffOptions): Promise<DiffResultArray<Field>> {
    return this.loadDataForDiff(diffOptions)
      .then(() => {
        let org1Fields = this.organization1.getFields();
        let org2Fields = this.organization2.getFields();

        // Get only fields associated to specific sources if specified
        if (diffOptions && diffOptions.sources && diffOptions.sources.length > 0) {
          org1Fields = this.returnOnlyFieldsForDesiredSources(org1Fields, diffOptions.sources);
          org2Fields = this.returnOnlyFieldsForDesiredSources(org2Fields, diffOptions.sources, org1Fields);
        }

        const diffResultArray = DiffUtils.getDiffResult(org1Fields, org2Fields, diffOptions);
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

  private loadDataForDiff(diffOptions?: IDiffOptions): Promise<{}> {
    if (diffOptions && diffOptions.originData) {
      Logger.verbose('Loading fields from local file');
      if (!Array.isArray(diffOptions.originData)) {
        Logger.error('Should provide an array of fields');
        throw { orgId: 'LocalFile', message: 'Should provide an array of fields' };
      }
      try {
        this.organization1.addFieldList(diffOptions.originData);
      } catch (error) {
        Logger.error('Invalid origin data');
        throw error;
      }
      return this.loadFieldsFromOnlyOneOrganization(this.organization2);
    } else {
      return this.loadFieldsFromBothOrganizations(this.organization1, this.organization2);
    }
  }

  private returnOnlyFieldsForDesiredSources(
    fieldDict: Dictionary<Field>,
    sources: string[],
    extraFields?: Dictionary<Field>
  ): Dictionary<Field> {
    each(fieldDict.values(), (field) => {
      if (!field.isPartOfTheSources(sources) && !(extraFields && extraFields.containsKey(field.getName()))) {
        fieldDict.remove(field.getName());
      }
    });

    return fieldDict;
  }

  /**
   * Download fields of one org.
   *
   * @returns {Promise<DownloadResultArray>}
   * @memberof FieldController
   */
  runDownloadSequence(): Promise<DownloadResultArray> {
    return FieldAPI.loadFields(this.organization1)
      .then(() => {
        return DownloadUtils.getDownloadResult(this.organization1.getFields());
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
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  runGraduateSequence(diffResultArray: DiffResultArray<Field>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating fields');

      each(union(diffResultArray.TO_CREATE, diffResultArray.TO_UPDATE), (field) => {
        // Strip parameters that should not be graduated
        field.removeParameters(options.keyBlacklist || [], options.keyWhitelist || []);
      });

      return Promise.all(
        map(
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

    return new Promise((resolve, reject) => {
      return FieldAPI.createFields(this.organization2, this.extractFieldModel(diffResult.TO_CREATE), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          resolve();
          this.successHandler(responses, 'POST operation successfully completed');
        })
        .catch((err: any) => {
          reject(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.UNABLE_TO_CREATE_FIELDS
          );
        });
    });
  }

  private graduateUpdated(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing field${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );

    return new Promise((resolve, reject) => {
      return FieldAPI.updateFields(this.organization2, this.extractFieldModel(diffResult.TO_UPDATE), this.fieldsPerBatch)
        .then((responses: RequestResponse[]) => {
          resolve();
          this.successHandler(responses, 'PUT operation successfully completed');
        })
        .catch((err: any) => {
          reject(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS
          );
        });
    });
  }

  private graduateDeleted(diffResult: DiffResultArray<Field>): Promise<void> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing field${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    return new Promise((resolve, reject) => {
      return FieldAPI.deleteFields(
        this.organization2,
        diffResult.TO_DELETE.map((field: Field) => field.getName()),
        this.deleteFieldsPerBatch
      )
        .then((responses: RequestResponse[]) => {
          resolve();
          this.successHandler(responses, 'DELETE operation successfully completed');
        })
        .catch((err: any) => {
          reject(err);
          this.errorHandler(
            { orgId: this.organization2.getId(), message: err } as IGenericError,
            StaticErrorMessage.UNABLE_TO_DELETE_FIELDS
          );
        });
    });
  }

  private loadFieldsFromBothOrganizations(organization1: Organization, organization2: Organization): Promise<Array<{}>> {
    Logger.loadingTask('Loading fields from both organizations');
    return Promise.all([FieldAPI.loadFields(organization1), FieldAPI.loadFields(organization2)]);
  }

  private loadFieldsFromOnlyOneOrganization(organization: Organization): Promise<{}> {
    Logger.loadingTask(`Loading fields from organization ${Colors.organization(organization.getId())}`);
    return FieldAPI.loadFields(organization);
  }

  private extractFieldModel(fields: Field[]): Array<IStringMap<any>> {
    return fields.map((field: Field) => field.getConfiguration());
  }

  private stripIdFromSourceParameter(obj: IStringMap<any>) {
    if (obj['sources']) {
      obj['sources'] = pluck(obj['sources'], 'name');
    }
    return obj;
  }

  extractionMethod(object: any[], diffOptions: IDiffOptions, oldVersion?: any[]): any[] {
    if (oldVersion === undefined) {
      return object.map((f: Field) => {
        const fieldModel = f.getConfiguration();
        return this.stripIdFromSourceParameter(fieldModel);
      });
    } else {
      return oldVersion.map((oldField: Field) => {
        const newField: Field = find(object, (f: Field) => {
          return f.getName() === oldField.getName();
        });

        const newFieldModel = newField.getConfiguration();
        const oldFieldModel = oldField.getConfiguration();

        const updatedFieldModel: IStringMap<any> = mapObject(newFieldModel, (val, key) => {
          if (!isEqual(oldFieldModel[key], val) && (!diffOptions.keysToIgnore || diffOptions.keysToIgnore.indexOf(key) === -1)) {
            return { newValue: val, oldValue: oldFieldModel[key] };
          } else {
            return val;
          }
        });
        return this.stripIdFromSourceParameter(updatedFieldModel);
      });
    }
  }
}
