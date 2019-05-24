import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { Organization } from '../../coveoObjects/Organization';
import { Colors } from '../colors';
import { IGenericError, StaticErrorMessage } from '../errors';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { IStringMap } from '../interfaces/IStringMap';
import { Pipeline } from '../../coveoObjects/Pipeline';

export class PipelineAPI {
  static loadPipelines(org: Organization): Promise<RequestResponse> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getAllPipelines(org)
        .then((response: RequestResponse) => {
          Assert.exists(response.body, StaticErrorMessage.UNEXPECTED_RESPONSE);

          org.addPipelineList(response.body);

          Logger.verbose(`${response.body.length} pipelines found in ${Colors.organization(org.getId())}`);

          this.getPipelinesStatements(org)
            .then(() => {
              resolve();
            })
            .catch((err: any) => {
              reject({ orgId: org.getId(), message: err } as IGenericError);
            });
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static getAllPipelines(organization: Organization): Promise<RequestResponse> {
    Logger.loadingTask(`Fetching pipelines from ${Colors.organization(organization.getId())} `);
    return RequestUtils.get(UrlService.getPipelinesUrl(organization.getId()), organization.getApiKey());
  }

  static createPipelines(org: Organization, fieldModels: Array<IStringMap<any>>): Promise<RequestResponse[]> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // TODO
    });
  }

  static updatePipelines(org: Organization, fieldModels: Array<IStringMap<any>>): Promise<RequestResponse[]> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // TODO
    });
  }

  static deletePipelines(org: Organization, pipelineList: string[]): Promise<RequestResponse[]> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // TODO
    });
  }

  static getPipelinesStatements(organization: Organization): Promise<Array<{}>> {
    const promiseList = new Array<Promise<any>>();
    _.each(organization.getPipelines().values(), (pipeline: Pipeline) => {
      promiseList.push(
        this.getPipelineStatement(pipeline, organization).then((response: RequestResponse) => {
          Assert.exists(response.body && response.body.statements, StaticErrorMessage.UNEXPECTED_RESPONSE);

          pipeline.addToFieldModel(response.body);
          organization.updatePipeline(pipeline);

          Logger.verbose(`Pipeline ${pipeline.getName()} statements loaded`);

          resolve();
        })
      );
    });
    return Promise.all(promiseList);
  }

  static getPipelineStatement(pipeline: Pipeline, organization: Organization) {
    Logger.loadingTask(`Fetching pipeline statements for ${Colors.pipelines(pipeline.getName())} `);
    return RequestUtils.get(UrlService.getPipelineStatementsUrl(pipeline.getId(), organization.getId()), organization.getApiKey());
  }
}
