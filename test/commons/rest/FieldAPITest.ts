// tslint:disable:no-magic-numbers
import * as sinon from 'sinon';
import * as nock from 'nock';
import { FieldAPI } from './../../../src/commons/rest/FieldAPI';
import { expect } from 'chai';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { parse } from 'url';
import { IStringMap } from '../../../src/commons/interfaces/IStringMap';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';

export const FieldAPITest = () => {
  describe('Field API', () => {
    const fieldList = [
      {
        name: 'allmetadatavalues',
        description: 'Place to put content for metadata discovery.',
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
      },
      {
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
      },
      {
        name: 'authorloginname',
        description: 'Login Name of the item author',
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
      },
      {
        name: 'bcc',
        description: 'The bcc email field',
        type: 'STRING',
        includeInQuery: false,
        includeInResults: true,
        mergeWithLexicon: true,
        smartDateFacet: false,
        facet: false,
        multiValueFacet: true,
        sort: true,
        ranking: false,
        stemming: false,
        multiValueFacetTokenizers: ';',
        useCacheForNestedQuery: false,
        useCacheForSort: false,
        useCacheForNumericQuery: false,
        useCacheForComputedFacet: false,
        dateFormat: '',
        system: false
      },
      {
        name: 'newField',
        description: '',
        type: 'STRING',
        includeInQuery: true,
        includeInResults: true,
        mergeWithLexicon: false,
        smartDateFacet: false,
        facet: true,
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
      }
    ];

    let scope: nock.Scope;

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    it('Should prepare the request to get the first page fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .get('/rest/organizations/qwerty123/indexes/page/fields')
        .query({ page: 0, perPage: 400, origin: 'USER' })
        .reply(RequestUtils.OK);

      FieldAPI.getFieldsPage(organization, 0)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should throw an error', () => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');
      expect(() => FieldAPI.getFieldsPage(organization, -1)).to.throw();
    });

    it('Should prepare the request to get the second page fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .get('/rest/organizations/qwerty456/indexes/page/fields')
        .query({ page: 1, perPage: 400, origin: 'USER' })
        .reply(RequestUtils.OK);

      FieldAPI.getFieldsPage(organization, 1)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the 1 request to create fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      // First expected request
      scope = nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty456/indexes/fields/batch/create', fieldList)
        .reply(RequestUtils.OK);

      FieldAPI.createFields(organization, JsonUtils.clone(fieldList), 10)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the 2 requests to create fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      // First expected request
      scope = nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty456/indexes/fields/batch/create', [
          {
            name: 'allmetadatavalues',
            description: 'Place to put content for metadata discovery.',
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
          },
          {
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
          },
          {
            name: 'authorloginname',
            description: 'Login Name of the item author',
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
          }
        ])
        .reply(RequestUtils.OK)
        // Second expected request
        .post('/rest/organizations/qwerty456/indexes/fields/batch/create', [
          {
            name: 'bcc',
            description: 'The bcc email field',
            type: 'STRING',
            includeInQuery: false,
            includeInResults: true,
            mergeWithLexicon: true,
            smartDateFacet: false,
            facet: false,
            multiValueFacet: true,
            sort: true,
            ranking: false,
            stemming: false,
            multiValueFacetTokenizers: ';',
            useCacheForNestedQuery: false,
            useCacheForSort: false,
            useCacheForNumericQuery: false,
            useCacheForComputedFacet: false,
            dateFormat: '',
            system: false
          },
          {
            name: 'newField',
            description: '',
            type: 'STRING',
            includeInQuery: true,
            includeInResults: true,
            mergeWithLexicon: false,
            smartDateFacet: false,
            facet: true,
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
          }
        ])
        .reply(RequestUtils.OK);

      FieldAPI.createFields(organization, JsonUtils.clone(fieldList), 3)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to update fields', (done: MochaDone) => {
      const organization: Organization = new Organization('myorg', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        // First expected request
        .put('/rest/organizations/myorg/indexes/fields/batch/update', [
          {
            name: 'allmetadatavalues',
            description: 'Place to put content for metadata discovery.',
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
          },
          {
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
          },
          {
            name: 'authorloginname',
            description: 'Login Name of the item author',
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
          }
        ])
        .reply(RequestUtils.OK)
        // Second expected request
        .put('/rest/organizations/myorg/indexes/fields/batch/update', [
          {
            name: 'bcc',
            description: 'The bcc email field',
            type: 'STRING',
            includeInQuery: false,
            includeInResults: true,
            mergeWithLexicon: true,
            smartDateFacet: false,
            facet: false,
            multiValueFacet: true,
            sort: true,
            ranking: false,
            stemming: false,
            multiValueFacetTokenizers: ';',
            useCacheForNestedQuery: false,
            useCacheForSort: false,
            useCacheForNumericQuery: false,
            useCacheForComputedFacet: false,
            dateFormat: '',
            system: false
          },
          {
            name: 'newField',
            description: '',
            type: 'STRING',
            includeInQuery: true,
            includeInResults: true,
            mergeWithLexicon: false,
            smartDateFacet: false,
            facet: true,
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
          }
        ])
        .reply(RequestUtils.OK);

      FieldAPI.updateFields(organization, JsonUtils.clone(fieldList), 3)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to delete fields', (done: MochaDone) => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');
      const fieldToDelete = ['allmetadatavalues', 'newfield', 'authorloginname', 'bcc', 'newField'];

      scope = nock(UrlService.getDefaultUrl())
        .delete('/rest/organizations/theorg/indexes/fields/batch/delete')
        .query({ fields: 'allmetadatavalues,newfield,authorloginname,bcc,newField' })
        .reply(RequestUtils.NO_CONTENT);

      FieldAPI.deleteFields(organization, fieldToDelete, 7)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare 3 requests to delete fields', (done: MochaDone) => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');
      const fieldToDelete = ['allmetadatavalues', 'newfield', 'authorloginname', 'bcc', 'newField'];

      scope = nock(UrlService.getDefaultUrl())
        // First expected request
        .delete('/rest/organizations/theorg/indexes/fields/batch/delete')
        .query({ fields: 'allmetadatavalues,newfield' })
        .reply(RequestUtils.NO_CONTENT)
        // Second expected request
        .delete('/rest/organizations/theorg/indexes/fields/batch/delete')
        .query({ fields: 'authorloginname,bcc' })
        .reply(RequestUtils.NO_CONTENT)
        // Third expected request
        .delete('/rest/organizations/theorg/indexes/fields/batch/delete')
        .query({ fields: 'newField' })
        .reply(RequestUtils.NO_CONTENT);

      FieldAPI.deleteFields(organization, fieldToDelete, 2)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to load other page field', (done: MochaDone) => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');

      scope = nock(UrlService.getDefaultUrl())
        // First expected request
        .get('/rest/organizations/theorg/indexes/page/fields')
        .query({ page: 1, perPage: 400, origin: 'USER' })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'field1',
              description: 'Place to put content for metadata discovery.',
              type: 'STRING'
            }
          ]
        })
        // Second expected request
        .get('/rest/organizations/theorg/indexes/page/fields')
        .query({ page: 2, perPage: 400, origin: 'USER' })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'field2',
              description: 'Place to put content for metadata discovery.',
              type: 'STRING'
            },
            {
              name: 'field3',
              description: 'Place to put content for metadata discovery.',
              type: 'STRING'
            }
          ]
        });

      FieldAPI.loadOtherPages(organization, 3)
        .then(() => {
          done();
        })
        .catch((err: any) => done(err));
    });

    it('Should throw an error', () => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');
      expect(() => FieldAPI.loadOtherPages(organization, -1)).to.throw();
    });

    // it('Should prepare the request to load all fields', (done: MochaDone) => {
    //   const organization: Organization = new Organization('theorg', 'xxx-xxx');
    // });

    it('Should add fields to the organization', () => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');

      expect(organization.getFields().getCount()).to.be.eql(0);
      FieldAPI.addLoadedFieldsToOrganization(organization, fieldList);
      expect(organization.getFields().getCount()).to.be.above(0);
    });
  });
};
