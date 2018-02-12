import { expect } from 'chai';
import { Field } from '../../src/coveoObjects/Field';
import { IStringMap } from '../../src/commons/interfaces/IStringMap';

export const FieldTest = () => {
  describe('Field Model', () => {
    const fieldModel: IStringMap<any> = {
      name: 'newfield',
      description: 'New field in prod only',
      type: 'STRING',
      includeInQuery: true,
      includeInResults: true,
      mergeWithLexicon: false,
      smartDateFacet: false,
      facet: false,
      multiValueFacet: false,
      sort: false,
      ranking: false,
      stemming: false,
      multiValueFacetTokenizers: ';',
      useCacheForNestedQuery: false,
      useCacheForSort: false,
      useCacheForNumericQuery: false,
      useCacheForComputedFacet: false,
      dateFormat: '',
      system: false
    };

    it('Should define field name (id) in the constructor', () => {
      const field: Field = new Field(fieldModel);
      expect(field.getId()).to.equal('newfield');
      expect(field.getName()).to.equal('newfield');
    });

    it('Should throw an error if field name (id) does not exists', () => {
      expect(() => new Field({ random: 'field' })).to.throw();
    });

    it('Should throw an error if invalid field body', () => {
      expect(() => new Field(undefined)).to.throw();
    });

    it('Should create a clone of the field object', () => {
      const simpleFieldModel = {
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING'
      };

      // Creating clone
      const field: Field = new Field(simpleFieldModel);
      const clone = field.clone();
      // Messing around with the original object
      simpleFieldModel.name = 'new name';

      expect(clone.getFieldModel()).to.eql({
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING'
      });
    });

    it('Should define field model in the constructor', () => {
      const field: Field = new Field(fieldModel);
      expect(field.getFieldModel()).to.be.eql({
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING',
        includeInQuery: true,
        includeInResults: true,
        mergeWithLexicon: false,
        smartDateFacet: false,
        facet: false,
        multiValueFacet: false,
        sort: false,
        ranking: false,
        stemming: false,
        multiValueFacetTokenizers: ';',
        useCacheForNestedQuery: false,
        useCacheForSort: false,
        useCacheForNumericQuery: false,
        useCacheForComputedFacet: false,
        dateFormat: '',
        system: false
      });
    });
  });
};
