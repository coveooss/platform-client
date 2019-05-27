import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { isUndefined } from 'util';
import { IDiffOptions } from '../commands/DiffCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { DownloadUtils } from '../commons/utils/DownloadUtils';
import { Organization } from '../coveoObjects/Organization';
import { BaseController } from './BaseController';
import { IGraduateOptions } from '../commands/GraduateCommand';
import { Pipeline } from '../coveoObjects/Pipeline';
import { PipelineAPI } from '../commons/rest/PipelineAPI';

export class PipelineController extends BaseController {
  static CONTROLLER_NAME: string = 'pipelines';

  constructor(private organization1: Organization, private organization2: Organization) {
    super();
  }

  /**
   * Performs a diff and return the result.
   *
   * @param {string[]} keysToIgnore Fields to ignore in the diff. For instance, someone
   * changed the "description" property of the pipeline in the destination org and you don't want the diff to tell you that it has changed.
   * @returns {Promise<DiffResultArray<Pipeline>>}
   */
  diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<Pipeline>> {
    return this.loadFieldForBothOrganizations(this.organization1, this.organization2)

      .then(() => {
        const org1Pipelines = this.organization1.getPipelines();
        const org2Pipelines = this.organization2.getPipelines();

        const diffResultArray = DiffUtils.getDiffResult(org1Pipelines, org2Pipelines, diffOptions);
        if (diffResultArray.containsItems()) {
          Logger.verbose('Diff Summary:');
          Logger.verbose(`${diffResultArray.TO_CREATE.length} new pipeline${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_DELETE.length} deleted pipeline${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
          Logger.verbose(`${diffResultArray.TO_UPDATE.length} updated pipeline${diffResultArray.TO_CREATE.length > 1 ? 's' : ''} found`);
        } else {
          Logger.info('The pipelines are identical in both organizations');
        }
        return diffResultArray;
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_PIPELINES);
        return Promise.reject(err);
      });
  }

  /**
   * Download the pipelienes of one org.
   * Provide the name of one of the orgs you specified in creator.
   *
   * @param {string} organization
   * @returns {Promise<IDownloadResultArray>}
   * @memberof PipelineController
   */
  download(organization: string): Promise<IDownloadResultArray> {
    const org = _.find([this.organization1, this.organization2], (x: Organization) => {
      return x.getId() === organization;
    });
    // _.find can return Undefined; PipelineAPI.loadPipelines expects
    const foundOrNot = isUndefined(org) ? new Organization('dummy', 'dummy') : org;
    return PipelineAPI.loadPipelines(foundOrNot)
      .then(() => {
        return DownloadUtils.getDownloadResult(foundOrNot.getPipelines());
      })
      .catch((err: IGenericError) => {
        this.errorHandler(err, StaticErrorMessage.UNABLE_TO_LOAD_PIPELINES);
        return Promise.reject(err);
      });
  }

  /**
   * Graduates the pipelines from origin Organization to the destination Organization.
   *
   * @param {DiffResultArray<Pipeline>} diffResultArray
   * @param {IGraduateOptions} options
   * @returns {Promise<any[]>}
   */
  graduate(diffResultArray: DiffResultArray<Pipeline>, options: IGraduateOptions): Promise<any[]> {
    if (diffResultArray.containsItems()) {
      Logger.loadingTask('Graduating pipelines');

      _.each(_.union(diffResultArray.TO_CREATE, diffResultArray.TO_DELETE, diffResultArray.TO_UPDATE), pipeline => {
        // Strip parameters that should not be graduated
        if (options.keysToStrip && options.keysToStrip.length > 0) {
          pipeline.removeParameters(options.keysToStrip);
        }
      });

      return Promise.all(
        _.map(
          this.getAuthorizedOperations(diffResultArray, this.graduateNew, this.graduateUpdated, this.graduateDeleted, options),
          (operation: (diffResult: DiffResultArray<Pipeline>) => Promise<void>) => {
            return operation.call(this, diffResultArray);
          }
        )
      );
    } else {
      Logger.warn('No pipelines to graduate');
      return Promise.resolve([]);
    }
  }

  private graduateNew(diffResult: DiffResultArray<Pipeline>): Promise<void> {
    Logger.verbose(
      `Creating ${diffResult.TO_CREATE.length} new pipeline${diffResult.TO_CREATE.length > 1 ? 's' : ''} in ${Colors.organization(
        this.organization2.getId()
      )} `
    );
    return PipelineAPI.createPipelines(this.organization2, this.extractFieldModel(diffResult.TO_CREATE))
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'POST operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler(
          { orgId: this.organization2.getId(), message: err } as IGenericError,
          StaticErrorMessage.UNABLE_TO_CREATE_PIPELINES
        );
      });
  }

  private graduateUpdated(diffResult: DiffResultArray<Pipeline>): Promise<void> {
    Logger.verbose(
      `Updating ${diffResult.TO_UPDATE.length} existing pipelines${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } in ${this.organization2.getId()} `
    );
    return PipelineAPI.updatePipelines(this.organization2, this.extractFieldModel(diffResult.TO_UPDATE))
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'PUT operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler(
          { orgId: this.organization2.getId(), message: err } as IGenericError,
          StaticErrorMessage.UNABLE_TO_CREATE_PIPELINES
        );
      });
  }

  private graduateDeleted(diffResult: DiffResultArray<Pipeline>): Promise<void> {
    Logger.verbose(
      `Deleting ${diffResult.TO_UPDATE.length} existing pipelines${
        diffResult.TO_CREATE.length > 1 ? 's' : ''
      } from ${this.organization2.getId()} `
    );
    return PipelineAPI.deletePipelines(this.organization2, _.map(diffResult.TO_DELETE, (pipeline: Pipeline) => pipeline.getName()))
      .then((responses: RequestResponse[]) => {
        this.successHandler(responses, 'DELETE operation successfully completed');
      })
      .catch((err: any) => {
        this.errorHandler(
          { orgId: this.organization2.getId(), message: err } as IGenericError,
          StaticErrorMessage.UNABLE_TO_DELETE_PIPELINES
        );
      });
  }

  private loadFieldForBothOrganizations(organization1: Organization, organization2: Organization): Promise<Array<{}>> {
    Logger.loadingTask('Loading pipelines for both organizations');
    return Promise.all([PipelineAPI.loadPipelines(organization1), PipelineAPI.loadPipelines(organization2)]);
  }

  private extractFieldModel(pipelines: Pipeline[]): Array<IStringMap<any>> {
    return _.map(pipelines, (pipeline: Pipeline) => pipeline.getFieldModel());
  }

  extractionMethod(object: any[], diffOptions: IDiffOptions, oldVersion?: any[]): any[] {
    const stripIdFromSourceParameter = (obj: IStringMap<any>) => {
      if (obj['sources']) {
        obj['sources'] = _.pluck(obj['sources'], 'name');
      }
      return obj;
    };
    if (oldVersion === undefined) {
      return _.map(object, (p: Pipeline) => {
        const fieldModel = p.getFieldModel();
        return stripIdFromSourceParameter(fieldModel);
      });
    } else {
      return _.map(oldVersion, (oldPipeline: Pipeline) => {
        const newPipeline: Pipeline = _.find(object, (f: Pipeline) => {
          return f.getName() === oldPipeline.getName();
        });

        const newFieldModel = newPipeline.getFieldModel();
        const oldFieldModel = oldPipeline.getFieldModel();

        const updatedFieldModel: IStringMap<any> = _.mapObject(newFieldModel, (val, key) => {
          if (!_.isEqual(oldFieldModel[key], val) && (!diffOptions.keysToIgnore || diffOptions.keysToIgnore.indexOf(key) === -1)) {
            return { newValue: val, oldValue: oldFieldModel[key] };
          } else {
            return val;
          }
        });
        return stripIdFromSourceParameter(updatedFieldModel);
      });
    }
  }
}
