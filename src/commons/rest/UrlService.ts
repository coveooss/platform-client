import { config } from './../../config/index';
import { Assert } from '../misc/Assert';

export class UrlService {
  static getDefaultUrl(path: string = ''): string {
    return `${config.coveo.platformUrl}${path}`;
  }

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

  static getSingleExtensionUrl(organizationId: string, extensionId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/extensions/${extensionId}`;
  }

  /*** Search API ***/
  static getQueryPipelinesUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/search/admin/pipelines/?&organizationId=${organizationId}`;
  }

  static getSearchApiAuthenticationsUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/authentication?&organizationId=${organizationId}`;
  }

  static getHostedSearchPagesUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/pages/`;
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
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/indexes/page/fields?&page=${page}&perPage=400&origin=USER`;
  }

  static updateFields(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/indexes/fields/batch/update`;
  }

  static createFields(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/indexes/fields/batch/create`;
  }

  static deleteFields(organizationId: string, fieldList: string[], separator: string = '%2C'): string {
    Assert.isLargerThan(0, fieldList.length);
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}/indexes/fields/batch/delete?fields=${fieldList.join(
      separator
    )}`;
  }
}
