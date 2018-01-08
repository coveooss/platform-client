import { expect } from 'chai';
import { Organization } from './../../src/coveoObjects/Organization';
import { FieldController } from './../../src/controllers/FieldController';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { Field } from '../../src/coveoObjects/Field';

export const FieldControllerTest = () => {
  describe('Field Controller', () => {
    // Organizations
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    // Fields

    const field1: Field = new Field('field1', {
      name: 'firstname',
      description: 'The first name of a person',
      type: 'STRING',
      includeInQuery: true
    });
    const field2: Field = new Field('field2', {
      name: 'lastname',
      description: 'The last name of a person',
      type: 'STRING',
      includeInQuery: true
    });
    const field3: Field = new Field('field3', {
      name: 'birth',
      description: 'Day of birth',
      type: 'Date',
      includeInQuery: false
    });

    // Controller
    const fieldController = new FieldController(org1, org2);

    it('Should return the clean diff version', () => {
      const diffResultArray: DiffResultArray<Field> = new DiffResultArray();
      diffResultArray.NEW.push(field1);
      diffResultArray.UPDATED.push(field2);
      diffResultArray.UPDATED.push(field3);

      const cleanVersion = fieldController.getCleanVersion(diffResultArray);
      expect(cleanVersion).to.eql({
        summary: { NEW: 1, UPDATED: 2, DELETED: 0 },
        NEW: [
          {
            name: 'firstname',
            description: 'The first name of a person',
            type: 'STRING',
            includeInQuery: true
          }
        ],
        UPDATED: [
          {
            name: 'lastname',
            description: 'The last name of a person',
            type: 'STRING',
            includeInQuery: true
          },
          {
            name: 'birth',
            description: 'Day of birth',
            type: 'Date',
            includeInQuery: false
          }
        ],
        DELETED: []
      });
    });
  });
};
