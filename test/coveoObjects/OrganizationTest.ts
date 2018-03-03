// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import { StaticErrorMessage } from '../../src/commons/errors';
import { Extension } from '../../src/coveoObjects/Extension';
import { Field } from '../../src/coveoObjects/Field';
import { Organization } from '../../src/coveoObjects/Organization';

export const OrganizationTest = () => {
  describe('Organization Model', () => {
    it('Should define organization Id and ApiKey', () => {
      const organization: Organization = new Organization('org1', 'xxx-aaa-123');
      expect(organization.getId()).to.equal('org1', 'Invalid organization Id');
      expect(organization.getApiKey()).to.equal('xxx-aaa-123', 'Invalid API Key');
    });

    describe('Fields Methods', () => {
      it('Should return the fields dictionary', () => {
        const organization: Organization = new Organization('rambo1', 'xxx-aaa-123');
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should clear all fields from the organization', () => {
        const organization: Organization = new Organization('rambo1', 'xxx-aaa-123');
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
          system: false
        });
        organization.addField(field);
        expect(organization.getFields().getCount()).to.equal(1);
        organization.clearFields();
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should not alter the dictionary from getter', () => {
        const organization: Organization = new Organization('rambo2', 'xxx-aaa-123');
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
          system: false
        });

        // Getters methods in Organization return a copy.
        organization.getFields().add(field.getName(), field);
        expect(organization.getFields().getCount()).to.equal(0);
        organization.getFields().clear();
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should add a new field to the organization', () => {
        const organization: Organization = new Organization('rambo3', 'xxx-aaa-123');
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
          system: false
        });
        organization.addField(field);
        expect(organization.getFields().getCount()).to.equal(1);
      });

      it('Should add multiple fields in the Organization', () => {
        const organization: Organization = new Organization('theorg', 'xxx-xxx');

        expect(organization.getFields().getCount()).to.be.eql(0);
        organization.addFieldList([
          {
            name: 'field1',
            description: 'Place to put content for metadata discovery.',
            type: 'STRING'
          },
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
        ]);
        expect(organization.getFields().getCount()).to.be.eql(3);
      });

      it('Should throw an error when adding invalid fields to the Organization', () => {
        const organization: Organization = new Organization('theorg', 'xxx-xxx');

        expect(organization.getFields().getCount()).to.be.eql(0);

        assert.throws(
          () =>
            organization.addFieldList([
              {
                invalidkey: 'invalidfield1',
                description: 'Place to put content for metadata discovery.',
                type: 'STRING'
              },
              {
                invalidkey: 'invalidfield2',
                description: 'Place to put content for metadata discovery.',
                type: 'STRING'
              }
            ]),
          StaticErrorMessage.INVALID_ID
        );
      });
    });

    describe('Sources Methods', () => {
      it('Should get the sources of the organisation', () => {
        const organization: Organization = new Organization('rambo18', 'xxx-aaa-123');
        const sources = organization.getSources();
        expect(sources.values()).to.eql([]);
      });
    });

    describe('Extensions Methods', () => {
      it('Should return the extensions dictionary', () => {
        const organization: Organization = new Organization('rainbow', 'xxx-aaa-123');
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should not alter the dictionary from getter', () => {
        const organization: Organization = new Organization('flower', 'xxx-aaa-123');
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
              healthIndicator: 'UNKNOWN'
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN'
            }
          }
        });
        organization.getExtensions().add(extension.getName(), extension);
        expect(organization.getExtensions().getCount()).to.equal(0);
        organization.getExtensions().clear();
        expect(organization.getExtensions().getCount()).to.equal(0);
      });

      it('Should clear all extensions from the organization', () => {
        const organization: Organization = new Organization('rambo1', 'xxx-aaa-123');
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
              healthIndicator: 'UNKNOWN'
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN'
            }
          }
        });
        organization.addExtension(extension);
        expect(organization.getExtensions().getCount()).to.equal(1);
        organization.clearExtensions();
        expect(organization.getExtensions().getCount()).to.equal(0);
      });

      it('Should add 2 extensions to the organization', () => {
        const organization: Organization = new Organization('flower', 'xxx-aaa-123');
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
              healthIndicator: 'UNKNOWN'
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN'
            }
          }
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
              healthIndicator: 'UNKNOWN'
            },
            dailyStatistics: {
              averageDurationInSeconds: 0,
              numberOfErrors: 0,
              numberOfExecutions: 0,
              numberOfSkips: 0,
              numberOfTimeouts: 0
            },
            disabledStatus: {},
            timeoutHealth: {
              healthIndicator: 'UNKNOWN'
            }
          }
        };
        organization.addMultipleExtensions([extension1, extension2]);
        expect(organization.getExtensions().getCount()).to.equal(2);
      });
    });
  });
};
