import { Organization } from '../../coveoObjects/Organization';
import { Assert } from '../misc/Assert';
import { EnvironmentUtils } from '../utils/EnvironmentUtils';

export class UrlService {
  static getDefaultUrl(platformUrl = EnvironmentUtils.getDefaultEnvironment()): string {
    return `${platformUrl}`;
  }

  /*** Organization API ***/
  static getOrganizationUrl(organization: Organization): string {
    return `${this.getDefaultUrl(organization.getPlatformUrl())}/rest/organizations/${organization.getId()}`;
  }

  /*** Extensions API ***/
  static getExtensionsUrl(organization: Organization): string {
    return `${this.getOrganizationUrl(organization)}/extensions`;
  }

  static getSingleExtensionUrl(organization: Organization, extensionId: string): string {
    return `${this.getOrganizationUrl(organization)}/extensions/${extensionId}`;
  }

  /*** Fields API ***/
  static getFieldDocs(platformUrl?: string): string {
    return `${this.getDefaultUrl(platformUrl)}/api-docs/Field?group=public`;
  }

  static getFieldsPageUrl(organization: Organization, page: number, perPage: number = 1000): string {
    return `${this.getOrganizationUrl(organization)}/sources/page/fields?&page=${page}&perPage=${perPage}&origin=ALL&includeMappings=false`;
  }

  static updateFields(organization: Organization): string {
    return `${this.getOrganizationUrl(organization)}/indexes/fields/batch/update`;
  }

  static createFields(organization: Organization): string {
    return `${this.getOrganizationUrl(organization)}/indexes/fields/batch/create`;
  }

  static deleteFields(organization: Organization, fieldList: string[], separator: string = '%2C'): string {
    Assert.isLargerThan(0, fieldList.length);
    return `${this.getOrganizationUrl(organization)}/indexes/fields/batch/delete?fields=${fieldList.join(separator)}`;
  }

  /*** Source API ***/
  static getSourcesUrl(organization: Organization): string {
    return `${this.getOrganizationUrl(organization)}/sources`;
  }

  static getSingleSourceUrl(organization: Organization, sourceId: string): string {
    return `${this.getOrganizationUrl(organization)}/sources/${sourceId}`;
  }

  static rebuildSource(organization: Organization, sourceId: string): string {
    return `${this.getOrganizationUrl(organization)}/sources/${sourceId}/rebuild`;
  }

  static getSingleRawSourceUrl(organization: Organization, sourceId: string): string {
    return `${this.getSingleSourceUrl(organization, sourceId)}/raw`;
  }

  static updateSource(organization: Organization, sourceId: string, rebuild = false): string {
    return `${this.getOrganizationUrl(organization)}/sources/${sourceId}/raw?rebuild=${rebuild}`;
  }

  static createSource(organization: Organization, rebuild = false): string {
    return `${this.getOrganizationUrl(organization)}/sources/raw?rebuild=${rebuild}`;
  }

  /*** Search Pages API ***/
  static getPagesUrl(organization: Organization): string {
    return `${this.getOrganizationUrl(organization)}/pages`;
  }

  static getSinglePageUrl(organization: Organization, pageId: string): string {
    return `${this.getOrganizationUrl(organization)}/pages/${pageId}`;
  }
}
