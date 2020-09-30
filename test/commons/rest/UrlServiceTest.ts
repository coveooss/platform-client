import { expect } from 'chai';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { TestOrganization } from '../../test';

export const UrlServiceTest = () => {
  describe('UrlServices', () => {
    const dummyOrg = new TestOrganization('myOrgId', 'xxx');

    it('Should generate the url to get fields', () => {
      const getFieldsPageUrl = UrlService.getFieldsPageUrl(dummyOrg, 0);
      expect(getFieldsPageUrl).to.equal(
        `${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/page/fields?&page=0&perPage=1000&origin=ALL&includeMappings=false`
      );
    });

    it('Should generate the url to get field definition', () => {
      const fieldDefinition = UrlService.getFieldDocs();
      expect(fieldDefinition).to.equal(`${dummyOrg.getPlatformUrl()}/api-docs/Field?group=public`);
    });

    it('Should generate the url to update fields', () => {
      const updateFields = UrlService.updateFields(dummyOrg);
      expect(updateFields).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/indexes/fields/batch/update`);
    });

    it('Should generate the url to get fields', () => {
      const createFields = UrlService.createFields(dummyOrg);
      expect(createFields).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/indexes/fields/batch/create`);
    });

    it('Should generate the url to delete fields', () => {
      const deleteFields = UrlService.deleteFields(dummyOrg, ['rambo', 'unicorne']);
      expect(deleteFields).to.equal(
        `${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/indexes/fields/batch/delete?fields=rambo%2Cunicorne`
      );
    });

    it('Should generate the url to get all extensions', () => {
      const createFields = UrlService.getExtensionsUrl(dummyOrg);
      expect(createFields).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/extensions`);
    });

    it('Should generate the url to get a specific extensions', () => {
      const createFields = UrlService.getSingleExtensionUrl(dummyOrg, 'myExtension');
      expect(createFields).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/extensions/myExtension`);
    });

    it('Should generate the url to get all sources', () => {
      const url = UrlService.getSourcesUrl(dummyOrg);
      expect(url).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources`);
    });

    it('Should generate the url to get a specific source', () => {
      const url = UrlService.getSingleRawSourceUrl(dummyOrg, 'mySource');
      expect(url).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/mySource/raw`);
    });

    it('Should generate the url to create a source', () => {
      const url = UrlService.createSource(dummyOrg);
      expect(url).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/raw?rebuild=false`);

      const url2 = UrlService.createSource(dummyOrg, true);
      expect(url2).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/raw?rebuild=true`);
    });

    it('Should generate the url to update a source', () => {
      const url = UrlService.updateSource(dummyOrg, 'mySource');
      expect(url).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/mySource/raw?rebuild=false`);

      const url2 = UrlService.updateSource(dummyOrg, 'mySource', true);
      expect(url2).to.equal(`${dummyOrg.getPlatformUrl()}/rest/organizations/myOrgId/sources/mySource/raw?rebuild=true`);
    });

    it('Should generate the url to get the Field documentation', () => {
      const fieldDoc = UrlService.getFieldDocs();
      expect(fieldDoc).to.equal(`${dummyOrg.getPlatformUrl()}/api-docs/Field?group=public`);
    });
  });
};
