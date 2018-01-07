import { Organization } from './../../src/coveoObjects/Organization';
import { FieldController } from './../../src/controllers/FieldController';

export const FieldControllerTest = () => {
  describe('Field Controller', () => {
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    const fieldController = new FieldController(org1, org2);

    it('Should return the clean diff version', () => {});
  });
};
