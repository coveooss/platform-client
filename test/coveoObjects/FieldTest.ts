import { expect, should } from 'chai';
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
      let field: Field = new Field('newfield', fieldModel);
      expect(field.getId()).to.equal('newfield');
      expect(field.getName()).to.equal('newfield');
    });

    it('Should define field model in the constructor', () => {
      let field: Field = new Field('newfield', fieldModel);
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
