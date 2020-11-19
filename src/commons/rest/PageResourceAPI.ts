import { RequestResponse } from 'request';
import { Organization } from '../../coveoObjects/Organization';
import { IStringMap } from '../interfaces/IStringMap';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';

export class PageResourceAPI {
  static createCssResource(org: Organization, pageId: string, data: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getCssResourcePageUrl(org, pageId);
    return RequestUtils.post(url, org.getApiKey(), data);
  }

  static updateCssResource(org: Organization, pageId: string, resourceName: string, data: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getSingleCssResourcePageUrl(org, pageId, resourceName);
    return RequestUtils.put(url, org.getApiKey(), data);
  }

  static deleteCssResource(org: Organization, pageId: string, resourceName: string): Promise<RequestResponse> {
    const url = UrlService.getSingleCssResourcePageUrl(org, pageId, resourceName);
    return RequestUtils.delete(url, org.getApiKey());
  }

  static createJavascriptResource(org: Organization, pageId: string, data: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getJavascriptResourcePageUrl(org, pageId);
    return RequestUtils.post(url, org.getApiKey(), data);
  }

  static updateJavascriptResource(
    org: Organization,
    pageId: string,
    resourceName: string,
    data: IStringMap<any>
  ): Promise<RequestResponse> {
    const url = UrlService.getSingleJavascriptResourcePageUrl(org, pageId, resourceName);
    return RequestUtils.put(url, org.getApiKey(), data);
  }

  static deleteJavascriptResource(org: Organization, pageId: string, resourceName: string): Promise<RequestResponse> {
    const url = UrlService.getSingleJavascriptResourcePageUrl(org, pageId, resourceName);
    return RequestUtils.delete(url, org.getApiKey());
  }

  // static getAllPages(organization: Organization): Promise<RequestResponse> {
  //   return RequestUtils.get(UrlService.getPagesUrl(organization), organization.getApiKey());
  // }

  // static loadPages(org: Organization): Promise<{}> {
  //   // tslint:disable-next-line:typedef
  //   return new Promise((resolve, reject) => {
  //     // Load all pages
  //     this.getAllPages(org)
  //       .then((response: RequestResponse) => {
  //         Assert.exists(response.body && Array.isArray(response.body), StaticErrorMessage.UNEXPECTED_RESPONSE);

  //         org.addPageList(response.body);

  //         Logger.verbose(
  //           `${response.body.length} page${response.body.length > 1 ? 's' : ''} from ${Colors.organization(org.getId())} to load`
  //         );
  //         resolve();

  //         each(response.body, (page: IStringMap<any>) => {
  //           Logger.info(`Successfully loaded page ${Colors.page(page['name'])}`);
  //         });

  //         // No need to load each page since all the pages are returned with the .getAllPages() call
  //       })
  //       .catch((err: any) => {
  //         reject({ orgId: org.getId(), message: err } as IGenericError);
  //       });
  //   });
  // }
}
