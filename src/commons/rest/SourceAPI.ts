import { contains, reject } from 'underscore';
import { series } from 'async';
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
import { StringUtil } from '../utils/StringUtils';

export class SourceAPI {
  static rebuildSource(org: Organization, sourceId: string): Promise<RequestResponse> {
    const url = UrlService.rebuildSource(org, sourceId);
    return RequestUtils.post(url, org.getApiKey(), null);
  }

  static createSource(org: Organization, sourceModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.createSource(org);
    return RequestUtils.post(url, org.getApiKey(), sourceModel);
  }

  static updateSource(org: Organization, sourceId: string, sourceModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.updateSource(org, sourceId);
    return RequestUtils.put(url, org.getApiKey(), sourceModel);
  }

  static deleteSource(org: Organization, sourceId: string): Promise<RequestResponse> {
    const url = UrlService.getSingleSourceUrl(org, sourceId);
    return RequestUtils.delete(url, org.getApiKey());
  }

  static getAllSources(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(UrlService.getSourcesUrl(organization), organization.getApiKey());
  }

  static getSingleSource(organization: Organization, sourceId: string): Promise<RequestResponse> {
    Assert.isNotUndefined(sourceId, 'Cannot load undefined source');
    return RequestUtils.get(UrlService.getSingleRawSourceUrl(organization, sourceId), organization.getApiKey());
  }

  static loadSources(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, subreject) => {
      // Load all sources
      this.getAllSources(org)
        .then((response: RequestResponse) => {
          // Load each source
          SourceAPI.loadEachSource(org, response)
            .then(() => resolve())
            .catch((err: any) => {
              subreject({ orgId: org.getId(), message: err } as IGenericError);
            });
        })
        .catch((err: any) => {
          subreject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static loadEachSource(org: Organization, response: RequestResponse) {
    const count = response.body.length;
    Logger.verbose(`${count} source${count > 1 ? 's' : ''} available in ${Colors.organization(org.getId())}`);

    // Reject all sources that have been blacklisted. Do not load blacklisted sources for nothing
    response.body = reject(response.body, (source: any) => {
      const sourceName: string = source['name'] || '';
      const condition = contains(org.getSourceBlacklist(), StringUtil.lowerAndStripSpaces(sourceName));
      if (condition) {
        Logger.info(`Skipping source ${Colors.source(sourceName)}`);
      }
      return condition;
    });

    const asyncArray = response.body.map((source: any) => {
      return (callback: any) => {
        Assert.exists(source['id'], StaticErrorMessage.MISSING_SOURCE_ID_FROM_THE_RESPONSE);
        Logger.loadingTask(`Loading source ${Colors.source(source['name'])} from ${Colors.organization(org.getId())}`);
        // tslint:disable-next-line:typedef
        return this.getSingleSource(org, source['id'])
          .then((sourceBody: RequestResponse) => {
            Logger.info(`Successfully loaded source ${Colors.source(source['name'])} from ${Colors.organization(org.getId())}`);
            this.addLoadedSourcesToOrganization(org, sourceBody.body);
            callback(null, source['name']);
          })
          .catch((err: any) => {
            callback(err, null);
          });
      };
    });

    return new Promise((resolve, subreject) => {
      series(asyncArray, (err, results) => {
        err ? subreject(err) : resolve();
      });
    });
  }

  static addLoadedSourcesToOrganization(org: Organization, sourceConfiguration: IStringMap<any>) {
    const source = new Source(sourceConfiguration);
    org.addSource(source);
  }
}
