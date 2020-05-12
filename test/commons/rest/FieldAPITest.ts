// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import * as nock from 'nock';
import { IGenericError, StaticErrorMessage } from '../../../src/commons/errors';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { FieldAPI } from './../../../src/commons/rest/FieldAPI';

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
        .get('/rest/organizations/qwerty123/sources/page/fields')
        .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
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
        .get('/rest/organizations/qwerty456/sources/page/fields')
        .query({ page: 1, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK);

      FieldAPI.getFieldsPage(organization, 1)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the 1 request to get field definition', (done: MochaDone) => {
      // First expected request
      scope = nock(UrlService.getDefaultUrl())
        .get('/api-docs/Field?group=public')
        .reply(RequestUtils.OK);

      FieldAPI.getFieldDefinitions()
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
        .reply(RequestUtils.NO_CONTENT)
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
        .reply(RequestUtils.NO_CONTENT);

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
        .get('/rest/organizations/theorg/sources/page/fields')
        .query({ page: 1, perPage: 1000, origin: 'ALL', includeMappings: false })
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
        .get('/rest/organizations/theorg/sources/page/fields')
        .query({ page: 2, perPage: 1000, origin: 'ALL', includeMappings: false })
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
          expect(organization.getFields().getCount()).to.be.eql(3);
          done();
        })
        .catch((err: any) => done(err));
    });

    it('Should throw an error', () => {
      const organization: Organization = new Organization('theorg', 'xxx-xxx');
      expect(() => FieldAPI.loadOtherPages(organization, -1)).to.throw();
    });

    it('Should throw an "Unexpected Response" error ', (done: MochaDone) => {
      const organization: Organization = new Organization('67ujnbgh', 'xxx-xxx');
      scope = nock(UrlService.getDefaultUrl())
        .get('/rest/organizations/67ujnbgh/sources/page/fields')
        .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK, { invalidKey: 'random value' });

      FieldAPI.loadFields(organization)
        .then(() => {
          done('This function should not resolve');
        })
        .catch((err: IGenericError) => {
          assert.throws(() => {
            throw Error(err.message);
          }, StaticErrorMessage.UNEXPECTED_RESPONSE);
          done();
        });
    });

    it('Should load all fields from the organization (one page)', (done: MochaDone) => {
      const organization: Organization = new Organization('hjkmnbfjhj3gfde45', 'xxx-xxx');
      scope = nock(UrlService.getDefaultUrl())
        // First expected request
        .get('/rest/organizations/hjkmnbfjhj3gfde45/sources/page/fields')
        .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'allmetadatavalues',
              description: '',
              type: 'STRING'
            },
            {
              name: 'attachmentdepth',
              description: 'The attachment depth.',
              type: 'STRING'
            },
            {
              name: 'attachmentparentid',
              description: 'The identifier of the attachment"s immediate parent, for parent/child relationship.',
              type: 'LONG'
            }
          ],
          totalPages: 1,
          totalEntries: 3
        });

      FieldAPI.loadFields(organization)
        .then(() => {
          expect(organization.getFields().getCount()).to.eql(3);
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });

    it('Should load all fields from the organization', (done: MochaDone) => {
      const organization: Organization = new Organization('hello', 'xxx-xxx');
      scope = nock(UrlService.getDefaultUrl())
        // First expected request
        .get('/rest/organizations/hello/sources/page/fields')
        .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'allmetadatavalues',
              description: '',
              type: 'STRING'
            },
            {
              name: 'attachmentdepth',
              description: 'The attachment depth.',
              type: 'STRING'
            },
            {
              name: 'attachmentparentid',
              description: 'The identifier of the attachment"s immediate parent, for parent/child relationship.',
              type: 'LONG'
            }
          ],
          totalPages: 3,
          totalEntries: 8
        })
        // Second expected request
        .get('/rest/organizations/hello/sources/page/fields')
        .query({ page: 1, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'author',
              description: 'The author of the document',
              type: 'STRING'
            },
            {
              name: 'authorloginname',
              description: 'Login Name of the item author',
              type: 'STRING'
            },
            {
              name: 'bcc',
              description: 'The bcc email field',
              type: 'STRING'
            }
          ],
          totalPages: 3,
          totalEntries: 8
        })
        // Third expected request
        .get('/rest/organizations/hello/sources/page/fields')
        .query({ page: 2, perPage: 1000, origin: 'ALL', includeMappings: false })
        .reply(RequestUtils.OK, {
          items: [
            {
              name: 'cc',
              description: 'The cc email field',
              type: 'STRING'
            },
            {
              name: 'clickableuri',
              description: 'The clickable URI of the document',
              type: 'STRING'
            }
          ],
          totalPages: 3,
          totalEntries: 8
        });

      FieldAPI.loadFields(organization)
        .then(() => {
          expect(organization.getFields().getCount()).to.eql(8);
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });
  });
};
