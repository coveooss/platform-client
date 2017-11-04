import { expect, should } from 'chai';
import { UrlService } from '../../../src/commons/services/UrlService';
import { config } from '../../../src/config/index';

export const UrlServiceTest = () => {
  describe('UrlServices', () => {

    it('Should generate the url to get fields', () => {
      let getFieldsPageUrl = UrlService.getFieldsPageUrl('myOrgId', 0);
      expect(getFieldsPageUrl).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/page/fields?&page=0&perPage=400&origin=USER`);
    });

    it('Should generate the url to update fields', () => {
      let updateFields = UrlService.updateFields('myOrgId');
      expect(updateFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/update`);
    });

    it('Should generate the url to get fields', () => {
      let createFields = UrlService.createFields('myOrgId');
      expect(createFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/create`);
    });

    it('Should generate the url to delete fields', () => {
      let deleteFields = UrlService.deleteFields('myOrgId', ['rambo', 'unicorne']);
      expect(deleteFields).to.equal(`${config.coveo.platformUrl}/rest/organizations/myOrgId/indexes/fields/batch/delete?fields=rambo%2Cunicorne`);
    });

  });
};
