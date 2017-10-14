import { expect, should } from 'chai';
import { Organization } from '../../src/models/OrganizationModel';

export const OrganizationModelTest = () => {
  describe('Organization Model', () => {

    describe(`Create a new Organization`, () => {
      it('Should define organization Id and ApiKey', () => {
        let organization: Organization = new Organization('org1', 'xxx-aaa-123');
        expect(organization.Id).to.equal('org1', 'Invalid organization Id');
        expect(organization.ApiKey).to.equal('xxx-aaa-123', 'Invalid API Key');
      });

      // it('...', () => {
      //   etc
      // })
    });
  })
}
