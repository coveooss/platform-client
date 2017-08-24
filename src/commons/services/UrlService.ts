// Required to require untyped modules
declare function require(path: string): any;
// External packages

// Internal packages
import { ObjectUtils } from '../utils/ObjectUtils';
import { config } from './../../config/index';
const URLSearchParams = require('url-search-params');

export class UrlService {
  /*** Organization API ***/
  static getOrganizationUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}`;
  }

  /*** Sources API ***/
  static getSourcesUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/sources`;
  }

  static getSingleSourceRawUrl(organizationId: string, sourceId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/sources/${sourceId}/raw`;
  }

  /*** Extensions API ***/
  static getExtensionsUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/extensions`;
  }

  static getSingleExtensionUrl(organizationId: string, extensionId: string, versionId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/extensions/${extensionId}/versions/${versionId}`;
  }

  /*** Search API ***/
  static getQueryPipelinesUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/search/admin/pipelines/?&organizationId=${organizationId}`
  }

  static getSearchApiAuthenticationsUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/authentication?&organizationId=${organizationId}`
  }

  static getHostedSearchPagesUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/pages/`
  }

  /*** Usage Analytics API ***/
  static getCustomDimensionsUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/ua/v15/dimensions/custom?includeOnlyParents=false&org=${organizationId}`;
  }

  static getNamedFiltersUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/ua/v15/filters/reporting?org=${organizationId}`;
  }

  static getReportsUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/ua/v15/reports?org=${organizationId}&indludeConfig=true`;
  }

  /*** Security Providers API ***/
  static getSecurityProvidersUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/securityproviders`;
  }

  static getSingleSecurityProviderUrl(organizationId: string, securityProviderId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/securityproviders/${securityProviderId}/raw`;
  }

  /*** Fields API ***/
  static getFieldsPageUrl(organizationId: string, page: number): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/indexes/page/fields?&page=${page}&perPage=1000&origin=ALL`;
  }

  /**
   * Serializes the form element so it can be passed to the back end through the url.
   * The objects properties are the keys and the objects values are the values.
   * ex: { "a":1, "b":2, "c":3 } would look like ?a=1&b=2&c=3
   * @param  {any} obj - The options to be url encoded
   * @returns string - The url encoded string
   */
  static serialize(obj: any): string {
    let containParams = false;
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && ObjectUtils.exists(obj[key])) {
        containParams = true;
        const element = obj[key];
        params.set(key, element.toString());
      }
    }

    const queryString = containParams ? '?' : '';
    return `${queryString}${ObjectUtils.anyTypeToString(params)}`;
  }
}
