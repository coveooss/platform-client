import { expect } from 'chai';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { config } from '../../../src/config/index';

export const UrlServiceTest = () => {
  describe('UrlServices', () => {
    it('Should generate the url to get fields', () => {
      const getFieldsPageUrl = UrlService.getFieldsPageUrl('myOrgId', 0);
      expect(getFieldsPageUrl).to.equal(
        `${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/page/fields?&page=0&perPage=1000&origin=USER`
      );
    });

    it('Should generate the url to get field definition', () => {
      const fieldDefinition = UrlService.getFieldDocs();
      expect(fieldDefinition).to.equal(`${config.coveo.platformUrl}/api-docs/Field?group=public`);
    });

    it('Should generate the url to update fields', () => {
      const updateFields = UrlService.updateFields('myOrgId');
      expect(updateFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/update`);
    });

    it('Should generate the url to get fields', () => {
      const createFields = UrlService.createFields('myOrgId');
      expect(createFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/create`);
    });

    it('Should generate the url to delete fields', () => {
      const deleteFields = UrlService.deleteFields('myOrgId', ['rambo', 'unicorne']);
      expect(deleteFields).to.equal(
        `${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/delete?fields=rambo%2Cunicorne`
      );
    });

    it('Should generate the url to get all extensions', () => {
      const createFields = UrlService.getExtensionsUrl('myOrgId');
      expect(createFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/extensions`);
    });

    it('Should generate the url to get a specific extensions', () => {
      const createFields = UrlService.getSingleExtensionUrl('myOrgId', 'myExtension');
      expect(createFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/extensions/myExtension`);
    });

    it('Should generate the url to get the Field documentation', () => {
      const fieldDoc = UrlService.getFieldDocs();
      expect(fieldDoc).to.equal(`${config.coveo.platformUrl}/api-docs/Field?group=public`);
    });
  });
};
