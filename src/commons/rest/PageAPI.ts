import * as _ from 'underscore';
import { series } from 'async';
import { RequestResponse } from 'request';
import { Organization } from '../../coveoObjects/Organization';
import { Colors } from '../colors';
import { IGenericError, StaticErrorMessage } from '../errors';
import { IStringMap } from '../interfaces/IStringMap';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { StringUtil } from '../utils/StringUtils';
import { Page } from '../../coveoObjects/Page';

export class PageAPI {
  static createPage(org: Organization, pageModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getPagesUrl(org.getId());
    return RequestUtils.post(url, org.getApiKey(), pageModel);
  }

  static updatePage(org: Organization, pageId: string, pageModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getSinglePageUrl(org.getId(), pageId);
    return RequestUtils.put(url, org.getApiKey(), pageModel);
  }

  static deletePage(org: Organization, pageId: string): Promise<RequestResponse> {
    const url = UrlService.getSinglePageUrl(org.getId(), pageId);
    return RequestUtils.delete(url, org.getApiKey());
  }

  static getAllPages(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(UrlService.getPagesUrl(organization.getId()), organization.getApiKey());
  }

  static getSinglePage(organization: Organization, pageId: string): Promise<RequestResponse> {
    Assert.isNotUndefined(pageId, 'Cannot load undefined page');
    return RequestUtils.get(UrlService.getSinglePageUrl(organization.getId(), pageId), organization.getApiKey());
  }

  static loadPages(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // Load all pages
      this.getAllPages(org)
        .then((response: RequestResponse) => {
          // Load each page
          PageAPI.loadEachPage(org, response)
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

  static getPageList(org: Organization): Promise<Array<{}>> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getAllPages(org)
        .then((response: RequestResponse) => {
          if (!Array.isArray(response.body)) {
            reject({
              orgId: org.getId(),
              message: 'Unexpected response from the API. An array of pages was expected'
            } as IGenericError);
          }
          resolve(response.body as Array<{}>);
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static loadEachPage(org: Organization, response: RequestResponse): Promise<{}> {
    const count = response.body.length;
    Logger.verbose(`${count} page${count > 1 ? 's' : ''} from ${Colors.organization(org.getId())}`);

    // Reject all pages that have been blacklisted. Do not load blacklisted pages for nothing
    response.body = _.reject(response.body, (page: any) => {
      const pageName: string = page['name'] || '';
      const condition = _.contains(org.getPageBlacklist(), StringUtil.lowerAndStripSpaces(pageName));
      if (condition) {
        Logger.info(`Skipping page ${Colors.page(pageName)}`);
      }
      return condition;
    });

    const asyncArray = _.map(response.body, (page: any) => {
      return (callback: any) => {
        Assert.exists(page['id'], StaticErrorMessage.MISSING_PAGE_ID_FROM_THE_RESPONSE);
        Logger.loadingTask(`Loading page ${Colors.page(page['name'])} from ${Colors.organization(org.getId())}`);
        this.getSinglePage(org, page['id'])
          .then((pageBody: RequestResponse) => {
            Logger.info(`Successfully loaded page ${Colors.page(page['name'])} from ${Colors.organization(org.getId())}`);
            this.addLoadedPagesToOrganization(org, pageBody.body);
            callback(null, page['name']);
          })
          .catch((err: any) => {
            callback(err, null);
          });
      };
    });

    return new Promise((resolve, reject) => {
      series(asyncArray, (err, results) => {
        err ? reject(err) : resolve();
      });
    });
  }

  static addLoadedPagesToOrganization(org: Organization, rawPage: IStringMap<any>) {
    const page = new Page(rawPage);
    org.addPage(page);
  }
}
