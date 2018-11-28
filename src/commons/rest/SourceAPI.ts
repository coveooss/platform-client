import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { Organization } from '../../coveoObjects/Organization';
import { IStringMap } from '../interfaces/IStringMap';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { IGenericError, StaticErrorMessage } from '../errors';
import { Logger } from '../logger';
import { Colors } from '../colors';
import { Assert } from '../misc/Assert';
import { Source } from '../../coveoObjects/Source';

export class SourceAPI {
  static getAllSources(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(UrlService.getSourcesUrl(organization.getId()), organization.getApiKey());
  }

  static getSingleSource(organization: Organization, sourceId: string): Promise<RequestResponse> {
    Assert.isNotUndefined(sourceId, 'Cannot load undefined source');
    return RequestUtils.get(UrlService.getSingleSourceUrl(organization.getId(), sourceId), organization.getApiKey());
  }

  static loadSources(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // Load all sources
      this.getAllSources(org)
        .then((response: RequestResponse) => {
          // Load each source
          SourceAPI.loadEachSource(org, response)
            .then(() => resolve())
            .catch((err: any) => {
              reject({ orgId: org.getId(), message: err } as IGenericError);
            });
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static loadEachSource(org: Organization, response: RequestResponse) {
    Logger.verbose(`${response.body.length} sources found from ${Colors.organization(org.getId())} to fetch`);
    return Promise.all(
      _.map(response.body, (source: any) => {
        Assert.exists(source['id'], StaticErrorMessage.MISSING_SOURCE_ID_FROM_THE_RESPONSE);
        Logger.loadingTask(`Loading ${Colors.source(source['name'])} source from ${Colors.organization(org.getId())}`);
        // tslint:disable-next-line:typedef
        return new Promise((resolve, reject) => {
          return this.getSingleSource(org, source['id'])
            .then((sourceBody: RequestResponse) => {
              Logger.verbose(`Successfully loaded ${Colors.source(source['name'])} source from ${Colors.organization(org.getId())}`);
              // TODO: add this function as a callback since it doesn't make sense to put it here
              this.addLoadedSourcesToOrganization(org, sourceBody.body);
              // TODO: add the sourceBody.body in the resolve
              resolve();
            })
            .catch((err: any) => {
              reject(err);
            });
        });
      })
    );
  }

  static addLoadedSourcesToOrganization(org: Organization, sourceConfiguration: IStringMap<any>) {
    const source = new Source(sourceConfiguration);
    org.addSource(source);
  }
}
