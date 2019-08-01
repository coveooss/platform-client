import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { Organization } from '../../coveoObjects/Organization';
import { IGenericError, StaticErrorMessage } from '../errors';
import { IStringMap } from '../interfaces/IStringMap';
import { Assert } from '../misc/Assert';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { Logger } from '../logger';
import { Colors } from '../colors';

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

  static loadPages(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // Load all pages
      this.getAllPages(org)
        .then((response: RequestResponse) => {
          Assert.exists(response.body && Array.isArray(response.body), StaticErrorMessage.UNEXPECTED_RESPONSE);

          org.addPageList(response.body);

          Logger.verbose(`${response.body.length} pages found in ${Colors.page(org.getId())}`);
          resolve();

          // No need to load each page since all the pages are returned with the .getAllPages() call
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }
}
