import { Assert } from '../misc/Assert';
import { EnvironmentUtils } from '../utils/EnvironmentUtils';

export class UrlService {
  static getDefaultUrl(path: string = ''): string {
    return `${EnvironmentUtils.getConfiguration().coveo.platformUrl}${path}`;
  }

  /*** Organization API ***/
  static getOrganizationUrl(organizationId: string): string {
    return `${EnvironmentUtils.getConfiguration().coveo.platformUrl}/rest/organizations/${organizationId}`;
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
    return `${EnvironmentUtils.getConfiguration().coveo.platformUrl}/api-docs/Field?group=public`;
  }

  static getFieldsPageUrl(organizationId: string, page: number, perPage: number = 1000): string {
    return `${this.getOrganizationUrl(
      organizationId
    )}/sources/page/fields?&page=${page}&perPage=${perPage}&origin=ALL&includeMappings=false`;
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

  static rebuildSource(organizationId: string, sourceId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/sources/${sourceId}/rebuild`;
  }

  static getSingleRawSourceUrl(organizationId: string, sourceId: string): string {
    return `${this.getSingleSourceUrl(organizationId, sourceId)}/raw`;
  }

  static updateSource(organizationId: string, sourceId: string, rebuild = false): string {
    return `${this.getOrganizationUrl(organizationId)}/sources/${sourceId}/raw?rebuild=${rebuild}`;
  }

  static createSource(organizationId: string, rebuild = false): string {
    return `${this.getOrganizationUrl(organizationId)}/sources/raw?rebuild=${rebuild}`;
  }

  /*** Search Pages API ***/
  static getPagesUrl(organizationId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/pages`;
  }

  static getSinglePageUrl(organizationId: string, pageId: string): string {
    return `${this.getOrganizationUrl(organizationId)}/pages/${pageId}`;
  }
}
