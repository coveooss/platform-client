import { Assert } from '../misc/Assert';
import { config } from './../../config/index';

export class UrlService {
  static getDefaultUrl(path: string = ''): string {
    return `${config.coveo.platformUrl}${path}`;
  }

  /*** Organization API ***/
  static getOrganizationUrl(organizationId: string): string {
    return `${config.coveo.platformUrl}/rest/organizations/${organizationId}`;
  }

  /*** Extensions API ***/
  static getExtensionsUrl(organizationId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/extensions`;
  }

  static getSingleExtensionUrl(organizationId: string, extensionId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/extensions/${extensionId}`;
  }

  /*** Fields API ***/
  static getFieldDocs(): string {
    return `${config.coveo.platformUrl}/api-docs/Field?group=public`;
  }

  static getFieldsPageUrl(organizationId: string, page: number, perPage: number = 1000): string {
    return `${this.getOrganizationUrl(
      organizationId
    )}/sources/page/fields?&page=${page}&perPage=${perPage}&origin=USER&includeMappings=false`;
  }

  static updateFields(organizationId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/indexes/fields/batch/update`;
  }

  static createFields(organizationId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/indexes/fields/batch/create`;
  }

  static deleteFields(organizationId: string, fieldList: string[], separator: string = '%2C'): string {
    Assert.isLargerThan(0, fieldList.length);
    return `${this.getOrganizationUrl(organizationId)}/indexes/fields/batch/delete?fields=${fieldList.join(separator)}`;
  }

  /*** Source API ***/
  static getSourcesUrl(organizationId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/sources`;
  }

  static getSingleSourceUrl(organizationId: string, sourceId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/sources/${sourceId}`;
  }

  static updateSource(organizationId: string, sourceId: string, rebuild = false): string {
    return `${this.getOrganizationUrl(organizationId)}/sources/${sourceId}?rebuild=${rebuild}`;
  }

  static createSource(organizationId: string, rebuild = false): string {
    return `${this.getOrganizationUrl(organizationId)}/sources?rebuild=${rebuild}`;
  }

  /*** Pipeline API ***/
  static getPipelineBaseUrl() {
    return `${config.coveo.platformUrl}/rest/search/v1/admin/pipelines`;
  }

  static getPipelinesUrl(organizationId: string, page: number = 0, perPage: number = 1000): string {
    return `${this.getPipelineBaseUrl()}?page=${page}&perPage=${perPage}&organizationId=${organizationId}`;
  }

  static getPipelineStatementsUrl(pipelineId: string, organizationId: string): string {
    return `${this.getPipelineBaseUrl()}/${pipelineId}/statements?organizationId=${organizationId}`;
  }
}
