import { expect, should } from 'chai';
import { Organization } from '../../src/coveoObjects/Organization';
import { Field } from '../../src/coveoObjects/Field';
import { Extension } from '../../src/coveoObjects/Extension';

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

      it('Should get the sources of the organisation', () => {
        const organization: Organization = new Organization('rambo18', 'xxx-aaa-123');
        const sources = organization.getSources();
        expect(sources.values()).to.eql([]);
      });

      it('Should not alter the dictionary from getter', () => {
        const organization: Organization = new Organization('rambo2', 'xxx-aaa-123');
        const field: Field = new Field('allmetadatavalues', {
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
        organization.getFields().add(field.getName(), field);
        expect(organization.getFields().getCount()).to.equal(0);
        organization.getFields().clear();
        expect(organization.getFields().getCount()).to.equal(0);
      });

      it('Should add a new field to the organization', () => {
        const organization: Organization = new Organization('rambo3', 'xxx-aaa-123');
        const field: Field = new Field('allmetadatavalues', {
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
        organization.addField(field.getName(), field);
        expect(organization.getFields().getCount()).to.equal(1);
      });
    });
  });
  describe('Extensions Methods', () => {
    it('Should return the extensions dictionary', () => {
      const organization: Organization = new Organization('rainbow', 'xxx-aaa-123');
      expect(organization.getFields().getCount()).to.equal(0);
    });

    it('Should not alter the dictionary from getter', () => {
      const organization: Organization = new Organization('flower', 'xxx-aaa-123');
      const extension: Extension = new Extension('Reject a document.', {
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

    it('Should add a new extension to the organization', () => {
      const organization: Organization = new Organization('flower', 'xxx-aaa-123');
      const extension: Extension = new Extension('Reject a document.', {
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
      organization.addExtensions(extension.getName(), extension);
      expect(organization.getExtensions().getCount()).to.equal(1);
    });
  });
};
