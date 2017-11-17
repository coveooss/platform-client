import { expect, should } from 'chai';
import { Organization } from '../../src/coveoObjects/Organization';

export const OrganizationTest = () => {
  describe('Organization Model', () => {

    it('Should define organization Id and ApiKey', () => {
      let organization: Organization = new Organization('org1', 'xxx-aaa-123');
      expect(organization.getId()).to.equal('org1', 'Invalid organization Id');
      expect(organization.getApiKey()).to.equal('xxx-aaa-123', 'Invalid API Key');
    });

  });
};
