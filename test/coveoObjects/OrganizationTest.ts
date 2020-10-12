// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import { Extension } from '../../src/coveoObjects/Extension';
import { Field } from '../../src/coveoObjects/Field';
import { Organization, IBlacklistObjects } from '../../src/coveoObjects/Organization';
import { Source } from '../../src/coveoObjects/Source';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { TestOrganization } from '../test';

export const OrganizationTest = () => {
  describe('Organization Model', () => {
    it('Should define organization Id and ApiKey', () => {
      const organization: Organization = new TestOrganization('org1', 'xxx-aaa-123');
      expect(organization.getId()).to.equal('org1', 'Invalid organization Id');
      expect(organization.getApiKey()).to.equal('xxx-aaa-123', 'Invalid API Key');
    });

    describe('Configuration Methods', () => {
      it('Should return the organization configuration', () => {
        const organization: Organization = new TestOrganization('org1', 'xxx-aaa-123');
        expect(organization.getConfiguration()).to.eql({
          fields: new Dictionary<Field>(),
          sources: new Dictionary<Source>(),
          extensions: new Dictionary<Extension>(),
        });
      });

      it('Should return the organization configuration', () => {
        const organization: Organization = new TestOrganization('org1', 'xxx-aaa-123');
        expect(organization.getConfiguration()).to.eql({
          fields: new Dictionary<Field>(),
          sources: new Dictionary<Source>(),
          extensions: new Dictionary<Extension>(),
        });
      });

      it('Should return the organization configuration', () => {
        const organization: Organization = new TestOrganization('org1', 'xxx-aaa-123');
        organization.addField(new Field({ name: 'myfield' }));

        const fieldDict = new Dictionary<Field>();
        fieldDict.add('myfield', new Field({ name: 'myfield' }));

        expect(organization.getConfiguration()).to.eql({
          fields: fieldDict,
          sources: new Dictionary<Source>(),
          extensions: new Dictionary<Extension>(),
        });
      });
    });

    describe('Fields Methods', () => {
      it('Should return the fields dictionary', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123');
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should clear all fields from the organization', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123');
        const field: Field = new Field({
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
          system: false,
        });
        organization.addField(field);
        expect(organization.getFields().getCount()).to.equal(1);
        organization.clearFields();
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should not alter the dictionary from getter', () => {
        const organization: Organization = new TestOrganization('rambo2', 'xxx-aaa-123');
        const field: Field = new Field({
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
          system: false,
        });

        // Getters methods in Organization return a copy.
        organization.getFields().add(field.getName(), field);
        expect(organization.getFields().getCount()).to.equal(0);
        organization.getFields().clear();
        expect(organization.getFields().getCount()).to.equal(0);
        expect(organization.isBlackListAccessControl()).to.be.false;
        expect(organization.isWhiteListAccessControl()).to.be.false;
      });

      it('Should add a new field to the organization', () => {
        const organization: Organization = new TestOrganization('rambo3', 'xxx-aaa-123');
        const field: Field = new Field({
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
          system: false,
        });
        organization.addField(field);
        expect(organization.getFields().getCount()).to.equal(1);
        expect(organization.isBlackListAccessControl()).to.be.false;
        expect(organization.isWhiteListAccessControl()).to.be.false;
      });

      it('Should not add field that has been blacklisted', () => {
        const blacklist = { fields: ['allmetadatavalues'] };
        const organization: Organization = new TestOrganization('rambo3', 'xxx-aaa-123', { blacklist });
        const field: Field = new Field({
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
          system: false,
        });
        organization.addField(field);
        expect(organization.getFields().getCount()).to.equal(0);
        expect(organization.isBlackListAccessControl()).to.be.true;
        expect(organization.isWhiteListAccessControl()).to.be.false;
      });

      it('Should not add field if not whitelisted whitelisted', () => {
        const whitelist = { fields: ['dummyfield'] };
        const organization: Organization = new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: whitelist });
        const field: Field = new Field({
          name: 'allmetadatavalues',
          description: 'Place to put content for metadata discovery.',
          type: 'STRING',
          includeInQuery: true,
        });
        const field2: Field = new Field({
          name: 'testfield',
          description: 'Place to put content for metadata discovery.',
          type: 'STRING',
          includeInQuery: true,
        });
        organization.addField(field);
        organization.addField(field2);

        expect(organization.getFields().getCount()).to.equal(0);
        expect(organization.isWhiteListAccessControl()).to.be.true;
        expect(organization.isBlackListAccessControl()).to.be.false;
      });

      it('Should not allow using both blacklist and whitelist strategies', () => {
        const list = { fields: ['dummyfield'] };
        assert.throws(() => new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: list, blacklist: list }));
      });

      it('Should not allow using both blacklist and whitelist strategies 2', () => {
        const list = { fields: ['dummyfield'] };
        assert.throws(() => new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: {}, blacklist: list }));
        assert.doesNotThrow(() => new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: undefined, blacklist: list }));
        assert.doesNotThrow(() => new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: list, blacklist: undefined }));
        assert.doesNotThrow(() => new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: undefined, blacklist: undefined }));
      });

      it('Should only add field that has been whitelisted', () => {
        const whitelist = { fields: ['testfield'] };
        const organization: Organization = new TestOrganization('rambo3', 'xxx-aaa-123', { whitelist: whitelist });
        const field: Field = new Field({
          name: 'allmetadatavalues',
          description: 'Place to put content for metadata discovery.',
          type: 'STRING',
          includeInQuery: true,
        });
        const field2: Field = new Field({
          name: 'testfield',
          description: 'Place to put content for metadata discovery.',
          type: 'STRING',
          includeInQuery: true,
        });
        organization.addField(field);
        organization.addField(field2);

        expect(organization.getFields().getCount()).to.equal(1);
        expect(organization.isWhiteListAccessControl()).to.be.true;
        expect(organization.isBlackListAccessControl()).to.be.false;
        expect(organization.getFields().values()[0].getName()).to.equal('testfield');
      });

      it('Should add multiple fields in the Organization', () => {
        const blacklist = { fields: ['fieldxxx'] };
        const organization: Organization = new TestOrganization('theorg', 'xxx-xxx', { blacklist });

        expect(organization.getFields().getCount()).to.be.eql(0);
        organization.addFieldList([
          {
            name: 'field1',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field2',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'fieldxxx',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field3',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
        ]);
        expect(organization.getFields().getCount()).to.be.eql(3);
        expect(organization.isBlackListAccessControl()).to.be.true;
        expect(organization.isWhiteListAccessControl()).to.be.false;
      });

      it('Should throw an error when adding invalid fields to the Organization', () => {
        const organization: Organization = new TestOrganization('theorg', 'xxx-xxx');

        expect(organization.getFields().getCount()).to.be.eql(0);

        assert.throws(
          () =>
            organization.addFieldList([
              {
                invalidkey: 'invalidfield1',
                description: 'Place to put content for metadata discovery.',
                type: 'STRING',
              },
              {
                invalidkey: 'invalidfield2',
                description: 'Place to put content for metadata discovery.',
                type: 'STRING',
              },
            ]),
          'Missing property "name" from fieldModel'
        );
      });
    });

    describe('Sources Methods', () => {
      it('Should get the sources of the organisation', () => {
        const organization: Organization = new TestOrganization('rambo18', 'xxx-aaa-123');
        const sources = organization.getSources();
        expect(sources.values()).to.eql([]);
      });
    });

    describe('Extensions Methods', () => {
      it('Should return the extensions dictionary', () => {
        const organization: Organization = new TestOrganization('rainbow', 'xxx-aaa-123');
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should not alter the dictionary from getter', () => {
        const organization: Organization = new TestOrganization('flower', 'xxx-aaa-123');
        const extension: Extension = new Extension({
          content: 'random content',
          createdDate: 1511812764000,
          description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
          enabled: true,
          id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
          lastModified: 1511812764000,
          name: 'Reject a document.',
          requiredDataStreams: [],
          versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
          usedBy: [],
          status: {
            durationHealth: {
              healthIndicator: 'UNKNOWN',
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0,
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN',
            },
          },
        });
        organization.getExtensions().add(extension.getName(), extension);
        expect(organization.getExtensions().getCount()).to.equal(0);
        organization.getExtensions().clear();
        expect(organization.getExtensions().getCount()).to.equal(0);
      });

      it('Should clear all extensions from the organization', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123');

        const source: Source = new Source({
          id: 'r6ud7iksjhafgjpiokjh-sdfgr3e',
          name: 'testSource',
          sourceType: 'SITEMAP',
          sourceSecurityOption: 'Specified',
          postConversionExtensions: [],
          preConversionExtensions: [],
          mappings: [],
          addressPatterns: [
            {
              expression: '*',
              patternType: 'Wildcard',
              allowed: true,
            },
          ],
          permissions: [
            {
              permissionSets: [
                {
                  allowedPermissions: [
                    {
                      identityType: 'Group',
                      securityProvider: 'Email Security Provider',
                      identity: '*@*',
                    },
                  ],
                },
              ],
            },
          ],
        });
        organization.addSource(source);
        expect(organization.getSources().getCount()).to.equal(1);
        organization.clearSources();
        expect(organization.getSources().getCount()).to.equal(0);
      });

      it('Should return the source, fields, and extensions that have been blacklisted', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123', {
          blacklist: {
            fields: ['mycustomfield'],
            sources: ['My Salesforce Source', 'YOUTUBE - source'],
            pages: ['test-page'],
          },
        });
        expect(organization.getfieldBlacklist()).to.eql(['mycustomfield']);
        expect(organization.getSourceBlacklist()).to.eql(['mysalesforcesource', 'youtube-source']);
        expect(organization.getExtensionBlacklist()).to.eql([]);
        expect(organization.getPageBlacklist()).to.eql(['test-page']);
      });

      it('Should return the organization platform URL', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123', {
          platformUrl: 'https://platform-au.cloud.coveo.com',
        });
        expect(organization.getPlatformUrl()).to.eql('https://platform-au.cloud.coveo.com');
      });

      it('Should return the organization default platform URL', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123');
        expect(organization.getPlatformUrl()).to.eql('https://platform.cloud.coveo.com');
      });

      it('Should add and clear all sources from the organization', () => {
        const organization: Organization = new TestOrganization('rambo1', 'xxx-aaa-123');
        const extension: Extension = new Extension({
          content: 'random content',
          createdDate: 1511812764000,
          description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
          enabled: true,
          id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
          lastModified: 1511812764000,
          name: 'Reject a document.',
          requiredDataStreams: [],
          versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
          usedBy: [],
          status: {
            durationHealth: {
              healthIndicator: 'UNKNOWN',
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0,
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN',
            },
          },
        });
        organization.addExtension(extension);
        expect(organization.getExtensions().getCount()).to.equal(1);
        organization.clearExtensions();
        expect(organization.getExtensions().getCount()).to.equal(0);
      });

      it('Should add 2 extensions to the organization', () => {
        const organization: Organization = new TestOrganization('flower', 'xxx-aaa-123');
        const extension1 = {
          content: 'random content',
          createdDate: 1511812764000,
          description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
          enabled: true,
          id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
          lastModified: 1511812764000,
          name: 'Reject a document.',
          requiredDataStreams: [],
          versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
          usedBy: [],
          status: {
            durationHealth: {
              healthIndicator: 'UNKNOWN',
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0,
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN',
            },
          },
        };
        const extension2 = {
          content:
            'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
          createdDate: 1511812769000,
          description: 'This extension is used to parse urls to extract metadata like categories.',
          enabled: true,
          id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
          lastModified: 1511812770000,
          name: 'URL Parsing to extract metadata',
          requiredDataStreams: [],
          versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX',
          usedBy: [],
          status: {
            durationHealth: {
              healthIndicator: 'UNKNOWN',
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0,
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN',
            },
          },
        };
        organization.addMultipleExtensions([extension1, extension2]);
        expect(organization.getExtensions().getCount()).to.equal(2);
      });

      it('Should not add an extensions that has been blacklisted', () => {
        const blacklist: IBlacklistObjects = { extensions: ['allmetadatavalues'] };
        const organization: Organization = new TestOrganization('flower', 'xxx-aaa-123', { blacklist });
        const extension1 = {
          content: 'random content',
          createdDate: 1511812764000,
          description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
          enabled: true,
          id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
          lastModified: 1511812764000,
          name: 'All Metadata Values',
          requiredDataStreams: [],
          versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
          usedBy: [],
          status: {
            durationHealth: {
              healthIndicator: 'UNKNOWN',
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0,
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN',
            },
          },
        };
        organization.addMultipleExtensions([extension1]);
        expect(organization.getExtensions().getCount()).to.equal(0);
      });

      it('Should clone an extension with all its fields, extensions and sources', () => {
        const organization: Organization = new TestOrganization('org321', 'xxx-aaa-123');
        const extension: Extension = new Extension({
          content: 'random content',
          createdDate: 1511812764000,
          description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
          enabled: true,
          id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
          lastModified: 1511812764000,
          name: 'Reject a document.',
          requiredDataStreams: [],
          versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
        });

        const source: Source = new Source({
          id: 'r6ud7iksjhafgjpiokjh-sdfgr3e',
          name: 'testSource',
          sourceType: 'SITEMAP',
          sourceSecurityOption: 'Specified',
          postConversionExtensions: [],
          preConversionExtensions: [],
          mappings: [
            {
              id: 'q6q72sozl73yjobkrl64cusemq',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'field1',
              content: '%[dsadsa]',
            },
            {
              id: 'dsaf3fdsfds',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'field2',
              content: '%[cccc]',
            },
          ],
          addressPatterns: [
            {
              expression: '*',
              patternType: 'Wildcard',
              allowed: true,
            },
          ],
          permissions: [
            {
              permissionSets: [
                {
                  allowedPermissions: [
                    {
                      identityType: 'Group',
                      securityProvider: 'Email Security Provider',
                      identity: '*@*',
                    },
                  ],
                },
              ],
            },
          ],
        });
        const fields = [
          {
            name: 'field1',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field2',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field3',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
        ];
        organization.addFieldList(fields);
        organization.addSource(source);
        organization.addExtension(extension);

        const copy = organization.clone();
        // clear orginial organization and make sure it does not affect the copy
        organization.clearAll();
        expect(copy.getId()).to.equal('org321');
        expect(copy.getApiKey()).to.equal('xxx-aaa-123');
        expect(copy.getFields().getCount()).to.equal(3);
        expect(copy.getExtensions().getCount()).to.equal(1);
        expect(copy.getSources().getCount()).to.equal(1);
        // Preserving source integrity
        expect(copy.getMissingFieldsBasedOnSourceMapping(copy.getSources().values()[0])).to.eql([]);
      });

      it('Should detect source integrity breach (missing fields)', () => {
        const organization: Organization = new TestOrganization('org321', 'xxx-aaa-123');

        const source: Source = new Source({
          id: 'r6ud7iksjhafgjpiokjh-sdfgr3e',
          name: 'testSource',
          sourceType: 'SITEMAP',
          sourceSecurityOption: 'Specified',
          postConversionExtensions: [],
          preConversionExtensions: [],
          mappings: [
            {
              id: 'q6q72sozl73yjobkrl64cusemq',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'field1',
              content: '%[dsadsa]',
            },
            {
              id: 'dsaf3fdsfds',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'field2',
              content: '%[cccc]',
            },
            {
              id: 'vcxvcxvcx',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'lastrebuilddate',
              content: 'Juste pour toi mon eric',
            },
            {
              id: 'vcxvcxvcx2',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'lastrebuilddate2',
              content: 'Juste pour toi mon eric',
            },
            {
              id: 'vcxvcxvcx3',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'lastrebuilddate3',
              content: 'Juste pour toi mon eric',
            },
          ],
          addressPatterns: [
            {
              expression: '*',
              patternType: 'Wildcard',
              allowed: true,
            },
          ],
          permissions: [
            {
              permissionSets: [
                {
                  allowedPermissions: [
                    {
                      identityType: 'Group',
                      securityProvider: 'Email Security Provider',
                      identity: '*@*',
                    },
                  ],
                },
              ],
            },
          ],
        });
        const fields = [
          {
            name: 'field1',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field2',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
          {
            name: 'field3',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING',
          },
        ];
        organization.addFieldList(fields);
        organization.addSource(source);

        const copy = organization.clone();
        // clear orginial organization and make sure it does not affect the copy
        organization.clearAll();
        // expect(copy.getId()).to.equal('org321');
        // expect(copy.getApiKey()).to.equal('xxx-aaa-123');
        expect(copy.getFields().getCount()).to.equal(3);
        expect(copy.getSources().getCount()).to.equal(1);
        expect(copy.getMissingFieldsBasedOnSourceMapping(copy.getSources().values()[0])).to.eql([
          'lastrebuilddate',
          'lastrebuilddate2',
          'lastrebuilddate3',
        ]);
      });
    });
  });
};
