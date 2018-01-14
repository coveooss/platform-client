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
    it('Should prepare the request to get the first page fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      nock(UrlService.getDefaultUrl())
        .get('/rest/organizations/qwerty123/indexes/page/fields')
        .query({ page: 0, perPage: 400, origin: 'USER' })
        .reply(RequestUtils.OK);

      FieldAPI.getFieldsPage(organization, 0)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to get the second page fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      nock(UrlService.getDefaultUrl())
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
      nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty456/indexes/fields/batch/create', JsonUtils.clone(fieldList))
        .reply(RequestUtils.OK);

      FieldAPI.createFields(organization, fieldList, 10)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the 2 requests to create fields', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      // First expected request
      nock(UrlService.getDefaultUrl())
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

      FieldAPI.createFields(organization, fieldList, 3)
        .then(() => done())
        .catch((err: any) => done(err));
    });
  });
};
