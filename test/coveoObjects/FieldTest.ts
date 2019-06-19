import { expect } from 'chai';
import { IStringMap } from '../../src/commons/interfaces/IStringMap';
import { Field } from '../../src/coveoObjects/Field';

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

    // it('Should throw an error if invalid field body', () => {
    //   expect(() => new Field(undefined)).to.throw();
    // });

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

      expect(clone.getConfiguration()).to.eql({
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING'
      });
    });

    it('Should define field model in the constructor', () => {
      const field: Field = new Field(fieldModel);
      expect(field.getConfiguration()).to.be.eql({
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

    it('Should return true if the field is associated to a source', () => {
      const cloneFieldModel = JSON.parse(JSON.stringify(fieldModel));
      cloneFieldModel.sources = [{ name: 'source1', id: 'dummyID' }, { name: 'source2', id: 'dummyID' }];

      const field: Field = new Field(cloneFieldModel);
      expect(field.isPartOfTheSources(['source1'])).to.be.true;
    });

    it('Should return true if the field is associated to at least one source', () => {
      const cloneFieldModel = JSON.parse(JSON.stringify(fieldModel));
      cloneFieldModel.sources = [{ name: 'source1', id: 'dummyID' }, { name: 'source2', id: 'dummyID' }];

      const field: Field = new Field(cloneFieldModel);
      expect(field.isPartOfTheSources(['source1', 'source3'])).to.be.true;
    });

    it('Should return false if the field is not associated to a source', () => {
      const cloneFieldModel = JSON.parse(JSON.stringify(fieldModel));
      cloneFieldModel.sources = [{ name: 'source1', id: 'dummyID' }];

      const field: Field = new Field(cloneFieldModel);
      expect(field.isPartOfTheSources(['sourceX'])).to.be.false;
    });

    it('Should remove some parameters (whitelist strategy)', () => {
      const field: Field = new Field(fieldModel);
      field.removeParameters([], ['name', 'description', 'type']);
      expect(field.getConfiguration()).to.eql({
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING'
      });
    });
    it('Should remove some parameters (blacklist strategy)', () => {
      const field: Field = new Field(fieldModel);
      field.removeParameters([
        'includeInQuery',
        'includeInResults',
        'mergeWithLexicon',
        'smartDateFacet',
        'facet',
        'multiValueFacet',
        'sort',
        'ranking',
        'stemming',
        'multiValueFacetTokenizers',
        'useCacheForNestedQuery',
        'useCacheForSort',
        'useCacheForNumericQuery',
        'useCacheForComputedFacet',
        'dateFormat',
        'system'
      ]);
      expect(field.getConfiguration()).to.eql({
        name: 'newfield',
        description: 'New field in prod only',
        type: 'STRING'
      });
    });
  });
};
