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
    return `${this.getOrganizationUrl(organizationId)}/indexes/page/fields?&page=${page}&perPage=${perPage}&origin=USER`;
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
    return `${this.getOrganizationUrl(organizationId)}/source/${sourceId}`;
  }
}
