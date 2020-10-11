import * as jsDiff from 'diff';
// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { where } from 'underscore';
import * as nock from 'nock';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { IGenericError, StaticErrorMessage } from '../../src/commons/errors';
import { UrlService } from '../../src/commons/rest/UrlService';
import { RequestUtils } from '../../src/commons/utils/RequestUtils';
import { Utils } from '../../src/commons/utils/Utils';
import { Source } from '../../src/coveoObjects/Source';
import { Organization } from '../../src/coveoObjects/Organization';
import { SourceController } from './../../src/controllers/SourceController';
import { IDiffOptions } from '../../src/commons/interfaces/IDiffOptions';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { JsonUtils } from '../../src/commons/utils/JsonUtils';
import { IGraduateOptions } from '../../src/commons/interfaces/IGraduateOptions';
import { DownloadResultArray } from '../../src/commons/collections/DownloadResultArray';
import { TestOrganization } from '../test';
import { Colors } from '../../src/commons/colors';

const allDevSources: Array<{}> = require('./../mocks/setup1/sources/dev/allSources.json');
const DEVrrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../mocks/setup1/sources/dev/web.json');
const DEVtcytrppteddiqkmboszu4skdoe: {} = require('./../mocks/setup1/sources/dev/sitemap.json');
const DEVwyowilfyrpf2qogxm45uhgskri: {} = require('./../mocks/setup1/sources/dev/salesforce.json');
const DEVqtngyd2gvxjxrrkftndaepcngu: {} = require('./../mocks/setup1/sources/dev/youtube.json');

const allProdSources: Array<{}> = require('./../mocks/setup1/sources/prod/allSources.json');
const PRODrrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../mocks/setup1/sources/prod/web.json');
const PRODtcytrppteddiqkmboszu4skdoe: {} = require('./../mocks/setup1/sources/prod/sitemap.json');
const PRODwyowilfyrpf2qogxm45uhgskri: {} = require('./../mocks/setup1/sources/prod/salesforce.json');

// const allDevExtensions: {} = require('./../mocks/setup1/extensions/dev/allExtensions.json');
// const q32rkqp2fzuz2b3rbw5d53kc2q: {} = require('./../mocks/setup1/extensions/dev/q32rkqp2fzuz2b3rbw5d53kc2q.json'); // used by no sources
// const qww6e7om4rommwdba5nk3ykc4e: {} = require('./../mocks/setup1/extensions/dev/qww6e7om4rommwdba5nk3ykc4e.json'); // used by no sources
// DEV Exensions
const DEVsfm7yvhqtiftmfuasrqtpfkio4: {} = require('./../mocks/setup1/extensions/dev/sfm7yvhqtiftmfuasrqtpfkio4.json');
const DEVsr3jny7s5ekuwuyaak45awcaku: {} = require('./../mocks/setup1/extensions/dev/sr3jny7s5ekuwuyaak45awcaku.json');
const DEVukjs6nvyjvqdn4vozf3ugjkdqe: {} = require('./../mocks/setup1/extensions/dev/ukjs6nvyjvqdn4vozf3ugjkdqe.json');
const DEVxnnutbu2n6kiwm243iossdsjha: {} = require('./../mocks/setup1/extensions/dev/xnnutbu2n6kiwm243iossdsjha.json');
const DEVxuklmyqaujg3gj2ivcynor2adq: {} = require('./../mocks/setup1/extensions/dev/xuklmyqaujg3gj2ivcynor2adq.json');

// Prod Exensions
const PRODsr3jny7s5ekuwuyaak45awcaku: {} = require('./../mocks/setup1/extensions/prod/sr3jny7s5ekuwuyaak45awcaku.json');
const PRODxnnutbu2n6kiwm243iossdsjha: {} = require('./../mocks/setup1/extensions/prod/xnnutbu2n6kiwm243iossdsjha.json');

// This is a copy of a dev source without any updates expect for some keys to ignore
// xze6hjeidrpcborfhqk4vxkgy4Copy

export const SourceControllerTest = () => {
  describe('Source Controller', () => {
    // Organizations
    const org1: Organization = new TestOrganization('dev', 'xxx');
    const org2: Organization = new TestOrganization('prod', 'yyy');

    // Controller
    const controller = new SourceController(org1, org2);

    let scope: nock.Scope;

    afterEach(() => {
      if (Utils.exists(scope)) {
        expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
      }

      // Reset Orgs
      org1.clearSources();
      org2.clearSources();
    });

    after(() => {
      nock.cleanAll();
    });

    describe('Extension ID and Name replacements', () => {
      it('Should replace extension ids with their according name', () => {
        const source1 = new Source(DEVtcytrppteddiqkmboszu4skdoe);
        const source2 = new Source(DEVwyowilfyrpf2qogxm45uhgskri);

        const sourceController = new SourceController(org1, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(), // Make a copy of the source
          Salesforce: source2.clone(), // Make a copy of the source
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku,
        ];

        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        const _source1 = sourceDict.getItem('Sitemap Source');
        expect(_source1.getPostConversionExtensions()[0]['extensionId']).to.eq('SharedVideosNormalization');
        expect(_source1.getPostConversionExtensions()[1]['extensionId']).to.eq('FilterVideos');

        const _source2 = sourceDict.getItem('Salesforce');
        expect(_source2.getPostConversionExtensions()[0]['extensionId']).to.eq('dummy extension');
        expect(_source2.getPostConversionExtensions()[1]['extensionId']).to.eq('FilterArticles');
      });

      it('Should remove extensions that have been blacklisted form the source configuration', () => {
        const org3 = new TestOrganization('dev', 'xxx', { blacklist: { extensions: ['SharedVideosNormalization'] } });
        const source1 = new Source(DEVtcytrppteddiqkmboszu4skdoe);
        const source2 = new Source(DEVwyowilfyrpf2qogxm45uhgskri);
        const sourceController = new SourceController(org3, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(), // Make a copy of the source
          Salesforce: source2.clone(), // Make a copy of the source
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku,
        ];

        expect(sourceDict.getItem('Sitemap Source').getPostConversionExtensions().length).to.eql(2);
        // First, replace extension IDs with their respective name
        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        // Now, remove blacklisted extensions
        sourceController.removeExtensionFromSource(sourceDict, org3);
        expect(sourceDict.getItem('Sitemap Source').getPostConversionExtensions().length).to.eql(1);
      });

      it('Should remove objects from the source configuration', () => {
        const salesforceSource = new Source(PRODwyowilfyrpf2qogxm45uhgskri);

        const keyWhitelist = [
          'logicalIndex',
          'postConversionExtensions',
          'preConversionExtensions',
          'configuration.addressPatterns',
          'configuration.parameters',
          'configuration.startingAddresses',
        ];

        const keyBlacklist = [
          'configuration.parameters.SourceId',
          'configuration.parameters.OrganizationId',
          'configuration.parameters.ClientSecret',
          'configuration.parameters.ClientId',
          'configuration.parameters.IsSandbox',
        ];

        salesforceSource.removeParameters(keyBlacklist, keyWhitelist);

        expect(salesforceSource.getConfiguration()).to.eql({
          configuration: {
            startingAddresses: ['http://www.salesforce.com'],
            addressPatterns: [{ expression: '*', patternType: 'Wildcard', allowed: true }],
            parameters: {
              PauseOnError: { sensitive: false, value: 'true' },
              SchemaVersion: { sensitive: false, value: 'LEGACY' },
              UseRefreshToken: { sensitive: false, value: 'true' },
            },
          },
          preConversionExtensions: [],
          postConversionExtensions: [
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'dummygroupproduction-sr3jny7s5ekuwuyaak45awcaku',
              parameters: {},
              versionId: '',
            },
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'dummygroupproduction-xnnutbu2n6kiwm243iossdsjha',
              parameters: {},
              versionId: '',
            },
          ],
          logicalIndex: 'default',
        });
      });

      it('Should replace extension name with their according id', () => {
        const source1 = new Source(DEVtcytrppteddiqkmboszu4skdoe);
        const source2 = new Source(DEVwyowilfyrpf2qogxm45uhgskri);
        const source1Clone = source1.clone();
        const source2Clone = source2.clone();

        const sourceController = new SourceController(org1, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1Clone,
          Salesforce: source2Clone,
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku,
        ];

        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        // Now do the revert operation
        sourceController.replaceExtensionNameWithId(source1Clone, extensionList);
        sourceController.replaceExtensionNameWithId(source2Clone, extensionList);

        const _source1 = sourceDict.getItem('Sitemap Source');
        expect(_source1.getPostConversionExtensions()[0]['extensionId']).to.eq('dummygroupk5f2dpwl-sfm7yvhqtiftmfuasrqtpfkio4');
        expect(_source1.getPostConversionExtensions()[1]['extensionId']).to.eq('dummygroupk5f2dpwl-ukjs6nvyjvqdn4vozf3ugjkdqe');

        const _source2 = sourceDict.getItem('Salesforce');
        expect(_source2.getPostConversionExtensions()[0]['extensionId']).to.eq('dummygroupk5f2dpwl-sr3jny7s5ekuwuyaak45awcaku');
        expect(_source2.getPostConversionExtensions()[1]['extensionId']).to.eq('dummygroupk5f2dpwl-xnnutbu2n6kiwm243iossdsjha');
      });

      it('Should throw an error if the extension does not exist in the organization', () => {
        const sourceController = new SourceController(org1, org2);
        const source1 = new Source(DEVtcytrppteddiqkmboszu4skdoe);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(),
        });

        expect(() => sourceController.replaceExtensionIdWithName(sourceDict, [])).to.throw();
        expect(() => sourceController.replaceExtensionNameWithId(source1.clone(), [])).to.throw();
      });
    });

    describe('Source Rebuild', () => {
      it('Should rebuild a source', (done: Mocha.Done) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources)
          .post('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/rebuild')
          .reply(RequestUtils.OK);

        controller
          .rebuildSource('My Sitemap Source')
          .then(() => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

      it('Should throw an error if trying to rebuild an invalid source', (done: Mocha.Done) => {
        scope = nock(UrlService.getDefaultUrl()).get('/rest/organizations/dev/sources').reply(RequestUtils.OK, allDevSources);

        controller
          .rebuildSource('Invalid source')
          .then(() => {
            done('Should not resolve');
          })
          .catch((err) => {
            if (err.message === StaticErrorMessage.NO_SOURCE_FOUND) {
              done();
            } else {
              done(err);
            }
          });
      });
    });

    describe('Diff Method', () => {
      it('Should support item types mapping', (done: Mocha.Done) => {
        const devMappings = [
          {
            id: 'rasdf33sgh2evy',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'videotype',
            extractionMethod: 'LITERAL',
            content: 'playlist',
          },
          {
            id: 'rasdfgh2evy',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'body',
            extractionMethod: 'LITERAL',
            content: 'New body value',
          },
          {
            id: 'fdkjslfkdsf',
            kind: 'COMMON',
            fieldName: 'body',
            extractionMethod: 'METADATA',
            content: '%[description]',
          },
        ];
        const prodMapping = [
          {
            id: 'fd345yujkmjnhgfdd',
            kind: 'COMMON',
            fieldName: 'body',
            extractionMethod: 'METADATA',
            content: '%[description]',
          },
          {
            id: 'dsadsdsad',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'videotype',
            extractionMethod: 'LITERAL',
            content: 'playlist',
          },
          {
            id: 'wertghj',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'body',
            extractionMethod: 'LITERAL',
            content: 'New body value',
          },
        ];

        const devSource = JsonUtils.clone(DEVtcytrppteddiqkmboszu4skdoe);
        devSource.mappings = devMappings;

        const prodSource = JsonUtils.clone(PRODtcytrppteddiqkmboszu4skdoe);
        prodSource.mappings = prodMapping;

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [DEVsfm7yvhqtiftmfuasrqtpfkio4, DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          // Replace mappings
          .reply(RequestUtils.OK, devSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, where(allProdSources, { name: 'My Sitemap Source' }))
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          // Replace mappings
          .reply(RequestUtils.OK, prodSource);

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: ['mappings'],
        };

        controller
          .runDiffSequence(diffOptions)
          .then((diffResultArray: DiffResultArray<Source>) => {
            expect(diffResultArray.TO_CREATE.length).to.eql(0);
            expect(diffResultArray.TO_UPDATE.length).to.eql(0);
            expect(diffResultArray.TO_DELETE.length).to.eql(0);

            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Extraction method should be agnostic to the mapping id and order', () => {
        const devSource = new Source({
          id: 'dev',
          name: 'mysource',
          mappings: [
            {
              id: 'rasdf33sgh2evy',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'videotype',
              extractionMethod: 'LITERAL',
              content: 'playlist',
            },
            {
              id: 'rasdfgh2evy',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'body',
              extractionMethod: 'LITERAL',
              content: 'New body value',
            },
            {
              id: 'fdkjslfkdsf',
              kind: 'COMMON',
              fieldName: 'body',
              extractionMethod: 'METADATA',
              content: '%[description]',
            },
          ],
          sourceType: 'Dummy',
          preConversionExtensions: [],
          postConversionExtensions: [],
        });

        const prodSource = new Source({
          id: 'prod',
          name: 'mysource',
          mappings: [
            {
              id: 'fd345yujkmjnhgfdd',
              kind: 'COMMON',
              fieldName: 'body',
              extractionMethod: 'METADATA',
              content: '%[description]',
            },
            {
              id: 'dsadsdsad',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'videotype',
              extractionMethod: 'LITERAL',
              content: 'playlist',
            },
            {
              id: 'wertghj',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'body',
              extractionMethod: 'LITERAL',
              content: 'New body value',
            },
          ],
          sourceType: 'Dummy',
          preConversionExtensions: [],
          postConversionExtensions: [],
        });

        const diffOptions: IDiffOptions = {
          includeOnly: ['mappings'],
        };

        // These 2 function are being called in the source diff
        devSource.sortMappingsAndStripIds();
        prodSource.sortMappingsAndStripIds();

        const cleanVersion: any = controller.extractionMethod([devSource], diffOptions, [prodSource]);

        const diff: jsDiff.Change[] = cleanVersion[0].mysource;

        // The mapping arrays should be similar
        expect(diff.length).to.eq(1);
        expect(diff[0].added).to.not.exist;
        expect(diff[0].removed).to.not.exist;
      });

      it('Should diff sources (updated)', (done: Mocha.Done) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [DEVsfm7yvhqtiftmfuasrqtpfkio4, DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, where(allProdSources, { name: 'My Sitemap Source' }))
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODtcytrppteddiqkmboszu4skdoe);

        const includeOnly = [
          'mappings',
          'postConversionExtensions',
          'preConversionExtensions',
          'configuration.addressPatterns',
          'configuration.documentConfig',
          'configuration.extendedDataFiles',
          'configuration.parameters',
          'veryOldParameter',
          'NewParameter',
          'configuration.startingAddresses',
        ];

        const keysToIgnore = [
          'configuration.parameters.SourceId',
          'configuration.parameters.OrganizationId',
          'configuration.parameters.ClientSecret',
          'configuration.parameters.ClientId',
          'configuration.parameters.IsSandbox',
          'resourceId',
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: includeOnly,
          keysToIgnore: keysToIgnore,
        };

        controller
          .runDiffSequence(diffOptions)
          .then((diffResultArray: DiffResultArray<Source>) => {
            expect(diffResultArray.TO_CREATE.length).to.eql(0);
            expect(diffResultArray.TO_UPDATE.length).to.eql(1);
            expect(diffResultArray.TO_DELETE.length).to.eql(0);

            const cleanVersion = controller.getCleanDiffVersion(diffResultArray, diffOptions);
            const updatedSource = cleanVersion.TO_UPDATE[0];

            // Make sure the blacklisted keys are not part of the diff
            expect(updatedSource['configuration.parameters.OrganizationId.value.newValue']).to.be.undefined;
            expect(updatedSource['configuration.parameters.OrganizationId.value.oldValue']).to.be.undefined;
            expect(updatedSource['resourceId.oldValue']).to.be.undefined;
            expect(updatedSource['resourceId.newValue']).to.be.undefined;

            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should diff sources (new - deleted)', (done: Mocha.Done) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [DEVsfm7yvhqtiftmfuasrqtpfkio4, DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, where(allProdSources, { name: 'My web source' }))
          .get('/rest/organizations/prod/sources/rrbbidfxa2ri4usxhzzmhq2hge-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODrrbbidfxa2ri4usxhzzmhq2hge);

        const keyWhitelist = [
          'mappings',
          'postConversionExtensions',
          'preConversionExtensions',
          'configuration.addressPatterns',
          'configuration.documentConfig',
          'configuration.extendedDataFiles',
          'configuration.parameters',
          'configuration.startingAddresses',
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: keyWhitelist,
        };

        controller
          .runDiffSequence(diffOptions)
          .then((diffResultArray: DiffResultArray<Source>) => {
            expect(diffResultArray.TO_CREATE.length).to.eql(1);
            expect(diffResultArray.TO_UPDATE.length).to.eql(0);
            expect(diffResultArray.TO_DELETE.length).to.eql(1);

            const cleanVersion = controller.getCleanDiffVersion(diffResultArray, diffOptions);

            expect(cleanVersion, "only Only print the souce's name if no modification was brought").to.eql({
              summary: {
                TO_CREATE: 1,
                TO_UPDATE: 0,
                TO_DELETE: 1,
              },
              TO_CREATE: ['My Sitemap Source'],
              TO_UPDATE: [],
              TO_DELETE: ['My web source'],
            });

            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should  throw an error if throttled by the REST API', (done: Mocha.Done) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(429, 'SOOOORRY') // Too many requests
          .get('/rest/organizations/prod/sources')
          .reply(429, 'SOOOORRY') // Too many requests
          .get('/rest/organizations/dev/extensions')
          .reply(429, 'SOOOORRY') // Too many requests
          .get('/rest/organizations/prod/extensions')
          .reply(429, 'SOOOORRY'); // Too many requests

        controller
          .runDiffSequence()
          .then(() => {
            done('Should not resolve');
          })
          .catch((err: IGenericError) => {
            // We are expecting an error
            expect(err.message).to.eql('"SOOOORRY"');
            done();
          });
      });

      it('Should not load extensions that have been blacklisted on the source diff', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx', {
          blacklist: { extensions: ['SharedVideosNormalization', 'FilterVideos'] },
        });
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [DEVsfm7yvhqtiftmfuasrqtpfkio4, DEVukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, where(allProdSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODtcytrppteddiqkmboszu4skdoe);

        const diffOptions: IDiffOptions = { includeOnly: ['postConversionExtensions'] };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            // No change detected because the extensions were blacklisted
            expect(diff.TO_CREATE.length).to.eql(0);
            expect(diff.TO_UPDATE.length).to.eql(0);
            expect(diff.TO_DELETE.length).to.eql(0);
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should not load sources that have been blacklisted for the diff', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx', { blacklist: { sources: ['My web source'] } });
        const orgy: Organization = new TestOrganization('prod', 'yyy', { blacklist: { sources: ['My web source'] } });
        const controllerxy = new SourceController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources)
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [
            DEVxuklmyqaujg3gj2ivcynor2adq,
            DEVsr3jny7s5ekuwuyaak45awcaku,
            DEVxnnutbu2n6kiwm243iossdsjha,
            DEVsfm7yvhqtiftmfuasrqtpfkio4,
            DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          ])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, [PRODsr3jny7s5ekuwuyaak45awcaku, PRODxnnutbu2n6kiwm243iossdsjha])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          .get('/rest/organizations/dev/sources/wyowilfyrpf2qogxm45uhgskri-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVwyowilfyrpf2qogxm45uhgskri)
          .get('/rest/organizations/dev/sources/qtngyd2gvxjxrrkftndaepcngu-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVqtngyd2gvxjxrrkftndaepcngu)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, allProdSources)
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODtcytrppteddiqkmboszu4skdoe)
          .get('/rest/organizations/prod/sources/wyowilfyrpf2qogxm45uhgskri-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODwyowilfyrpf2qogxm45uhgskri);

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            // We don't care about the diff result here. We just wan to make sure the Diff command ignored the blacklisted sources
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should take into account new and missing parameters in the source configuration', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          mappings: [
            {
              id: 'q4qripnnvztvqempxtkvdb2cqa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          parameterNotInProduction: 'dsa',
          resourceId: 'dev-source4',
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          mappings: [
            {
              id: 'q4qripnnvztvqempxtkvdb2cqa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
          enableJavaScript: false,
          javaScriptLoadingDelayInMilliseconds: 0,
          requestsTimeoutInSeconds: 100,
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource])
          .get('/rest/organizations/prod/sources/prod-source/raw')
          .reply(RequestUtils.OK, localProdSource);

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(0);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(0);
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });
    });

    describe('getCleanDiffVersion Method', () => {
      it('Should return the clean diff version - empty', () => {
        const diffResultArray: DiffResultArray<Source> = new DiffResultArray();
        const cleanVersion = controller.getCleanDiffVersion(diffResultArray, {});
        expect(cleanVersion).to.eql({
          summary: { TO_CREATE: 0, TO_UPDATE: 0, TO_DELETE: 0 },
          TO_CREATE: [],
          TO_UPDATE: [],
          TO_DELETE: [],
        });
      });
    });

    describe('Graduate Method', () => {
      it('Should graduate using the blacklist strategy', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          configuration: { parameters: { isSandbox: { value: true }, customParam: 'new-param' } },
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          owner: 'prod-owner@coveo.com',
          configuration: { parameters: { isSandbox: { value: false }, customParam: 'prod-something' } },
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource])
          .get('/rest/organizations/prod/sources/prod-source/raw')
          .reply(RequestUtils.OK, localProdSource)
          // Graduation time!
          .put('/rest/organizations/prod/sources/prod-source/raw?rebuild=false', {
            sourceType: 'SITEMAP',
            name: 'sitemap test',
            id: 'prod-source', // Prod value
            owner: 'prod-owner@coveo.com', // Prod value
            configuration: { parameters: { isSandbox: { value: false }, customParam: 'new-param' } },
            mappings: [
              {
                id: 'xxxxxa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
              {
                id: 'xxxxxb',
                kind: 'COMMON',
                fieldName: 'uri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'prod-source', // Prod value
          })
          .reply(RequestUtils.OK);

        const keysToIgnore = ['information', 'resourceId', 'id', 'owner', 'configuration.parameters.isSandbox'];
        const diffOptions = { keysToIgnore: keysToIgnore };
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: diffOptions,
          keyBlacklist: keysToIgnore,
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(0);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(0);
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then((resolved: any[]) => {
                done();
              })
              .catch((err: any) => {
                done(err);
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should graduate using the whitelist strategy', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'DEV value that should not be graduated' },
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        const localDevSource2 = {
          sourceType: 'WEB',
          id: 'web-source',
          name: 'web test',
          mappings: [
            {
              id: 'qwert',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'abcd',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'web-source',
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'something' },
          owner: 'prod-owner@coveo.com',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
        };
        const localProdSource2 = {
          sourceType: 'SITEMAP',
          id: 'prod-source2',
          name: 'websource test',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source2',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource, localDevSource2])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          .get('/rest/organizations/dev/sources/web-source/raw')
          .reply(RequestUtils.OK, localDevSource2)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource, localProdSource2])
          .get('/rest/organizations/prod/sources/prod-source/raw')
          .reply(RequestUtils.OK, localProdSource)
          .get('/rest/organizations/prod/sources/prod-source2/raw')
          .reply(RequestUtils.OK, localProdSource2)
          // Graduation time!
          .post('/rest/organizations/prod/sources/raw?rebuild=false', {
            sourceType: 'WEB',
            id: 'web-source',
            name: 'web test',
            mappings: [
              {
                id: 'abcd',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
              {
                id: 'qwert',
                kind: 'COMMON',
                fieldName: 'uri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            owner: 'test@coveo.com',
            resourceId: 'web-source',
          })
          .reply(RequestUtils.OK)
          .put('/rest/organizations/prod/sources/prod-source/raw?rebuild=false', {
            sourceType: 'SITEMAP',
            id: 'prod-source',
            name: 'sitemap test',
            parameters: { prodParameter: 'something' },
            owner: 'prod-owner@coveo.com',
            mappings: [
              {
                id: 'xxxxxa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
              {
                id: 'xxxxxb',
                kind: 'COMMON',
                fieldName: 'uri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'prod-source',
          })
          .reply(RequestUtils.OK)
          .delete('/rest/organizations/prod/sources/prod-source2')
          .reply(RequestUtils.NO_CONTENT);

        const diffOptions: IDiffOptions = { includeOnly: ['name', 'mappings'] };
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: diffOptions,
          keyWhitelist: ['name', 'mappings'],
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(1);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(1);
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then((resolved: any[]) => {
                done();
              })
              .catch((err: any) => {
                done(err);
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should handle too many request in graduation', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'DEV value that should not be graduated' },
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        const localDevSource2 = {
          sourceType: 'WEB',
          id: 'web-source',
          name: 'web test',
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'web-source',
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'something' },
          owner: 'prod-owner@coveo.com',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
        };

        const localProdSource2 = {
          sourceType: 'SITEMAP',
          id: 'prod-source2',
          name: 'websource test',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source2',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource, localDevSource2])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          .get('/rest/organizations/dev/sources/web-source/raw')
          .reply(RequestUtils.OK, localDevSource2)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource, localProdSource2])
          .get('/rest/organizations/prod/sources/prod-source/raw')
          .reply(RequestUtils.OK, localProdSource)
          .get('/rest/organizations/prod/sources/prod-source2/raw')
          .reply(RequestUtils.OK, localProdSource2)
          // Graduation time!
          .post('/rest/organizations/prod/sources/raw?rebuild=false', {
            sourceType: 'WEB',
            id: 'web-source',
            name: 'web test',
            mappings: [],
            preConversionExtensions: [],
            postConversionExtensions: [],
            owner: 'test@coveo.com',
            resourceId: 'web-source',
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .put('/rest/organizations/prod/sources/prod-source/raw?rebuild=false', {
            sourceType: 'SITEMAP',
            id: 'prod-source',
            name: 'sitemap test',
            parameters: { prodParameter: 'something' },
            owner: 'prod-owner@coveo.com',
            mappings: [
              {
                id: 'xxxxxa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
              {
                id: 'xxxxxb',
                kind: 'COMMON',
                fieldName: 'uri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'prod-source',
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .delete('/rest/organizations/prod/sources/prod-source2')
          .reply(429, 'TOO_MANY_REQUESTS');

        const diffOptions: IDiffOptions = { includeOnly: ['name', 'mappings'] };
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: diffOptions,
          keyWhitelist: ['name', 'mappings'],
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(1);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(1);
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then((resolved: any[]) => {
                done('Should not resolve');
              })
              .catch((err: any) => {
                expect(err).to.eql('"TOO_MANY_REQUESTS"');
                done();
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should not graduate source with security providers', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'security provider source',
          configuration: {
            parameters: { isSandbox: { value: true }, customParam: 'new-param' },
            securityProviders: {
              SecurityProvider: {
                name: 'SALESFORCE-23456789098765',
                typeName: 'Salesforce',
              },
            },
          },
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, []);
        // Nothing to graduate!

        const diffOptions = {};
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: false,
          DELETE: false,
          diffOptions: diffOptions,
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then(() => {
                done('Should not resolve');
              })
              .catch((err) => {
                if (
                  err.message ===
                  'Cannot create source with security provider. Please create the source manually in the destination org first.'
                ) {
                  done();
                } else {
                  done(err);
                }
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should graduate using and respect field integrity', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'DEV value that should not be graduated' },
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        const localDevSource2 = {
          sourceType: 'WEB',
          id: 'web-source',
          name: 'web test',
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'anotherfield',
              extractionMethod: 'METADATA',
              content: '%[anotherfield]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'web-source',
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'something' },
          owner: 'prod-owner@coveo.com',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
        };

        const localProdSource2 = {
          sourceType: 'SITEMAP',
          id: 'prod-source2',
          name: 'websource test',
          mappings: [
            {
              id: 'yyyyyyb',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source2',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource, localDevSource2])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          .get('/rest/organizations/dev/sources/web-source/raw')
          .reply(RequestUtils.OK, localDevSource2)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource, localProdSource2])
          .get('/rest/organizations/prod/sources/prod-source/raw')
          .reply(RequestUtils.OK, localProdSource)
          .get('/rest/organizations/prod/sources/prod-source2/raw')
          .reply(RequestUtils.OK, localProdSource2)
          .get('/rest/organizations/prod/sources/page/fields')
          .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
          .reply(RequestUtils.OK, {
            items: [
              {
                name: 'uri',
                description: 'new description',
                type: 'STRING',
              },
              {
                name: 'printableuri',
                description: 'The attachment depth.',
                type: 'STRING',
              },
              {
                name: 'anotherfield',
                description: '',
                type: 'STRING',
              },
            ],
            totalPages: 1,
            totalEntries: 2,
          })
          // Graduation time!
          .post('/rest/organizations/prod/sources/raw?rebuild=false', {
            sourceType: 'WEB',
            id: 'web-source',
            name: 'web test',
            mappings: [
              {
                id: 'xxxxxb',
                kind: 'COMMON',
                fieldName: 'anotherfield',
                extractionMethod: 'METADATA',
                content: '%[anotherfield]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            owner: 'test@coveo.com',
            resourceId: 'web-source',
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .put('/rest/organizations/prod/sources/prod-source/raw?rebuild=false', {
            sourceType: 'SITEMAP',
            id: 'prod-source',
            name: 'sitemap test',
            parameters: { prodParameter: 'something' },
            owner: 'prod-owner@coveo.com',
            mappings: [
              {
                id: 'xxxxxa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
              {
                id: 'xxxxxb',
                kind: 'COMMON',
                fieldName: 'uri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]',
              },
            ],
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'prod-source',
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .delete('/rest/organizations/prod/sources/prod-source2')
          .reply(429, 'TOO_MANY_REQUESTS');

        const diffOptions: IDiffOptions = { includeOnly: ['name', 'mappings'] };
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: diffOptions,
          keyWhitelist: ['name', 'mappings'],
          ensureFieldIntegrity: true,
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(1);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(1);
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then((resolved: any[]) => {
                done('Should not resolve');
              })
              .catch((err: any) => {
                expect(err).to.eql('"TOO_MANY_REQUESTS"');
                done();
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      // it('Should not graduate because field integrity is not preserved (PUT only)', (done: Mocha.Done) => {
      //   // TODO:
      // });

      it('Should not graduate because field integrity is not preserved (POST only)', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemap test',
          parameters: { prodParameter: 'DEV value that should not be graduated' },
          mappings: [
            {
              id: 'xxxxxb',
              kind: 'COMMON',
              fieldName: 'uri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'printableuri',
              extractionMethod: 'METADATA',
              content: '%[printableuri]',
            },
            // This last mapping should trigger a graduation error because the fields does not exist in the source
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'lastrebuilddate',
              extractionMethod: 'METADATA',
              content: '%[lastrebuilddate]',
            },
            {
              id: 'xxxxxa',
              kind: 'COMMON',
              fieldName: 'anothernewfield',
              extractionMethod: 'METADATA',
              content: '%[lastrebuilddate]',
            },
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          owner: 'test@coveo.com',
          resourceId: 'dev-source',
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source/raw')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [])
          // Fecthing all prod fields
          .get('/rest/organizations/prod/sources/page/fields')
          .query({ page: 0, perPage: 1000, origin: 'ALL', includeMappings: false })
          .reply(RequestUtils.OK, {
            items: [
              {
                name: 'printableuri',
                description: '',
                type: 'STRING',
              },
              {
                name: 'uri',
                description: '',
                type: 'STRING',
              },
            ],
            totalPages: 1,
            totalEntries: 2,
          });
        // No graduation this time

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {},
          ensureFieldIntegrity: true,
        };
        controllerxy
          .runDiffSequence({})
          .then((diff: DiffResultArray<Source>) => {
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then(() => {
                done('Should not resolve');
              })
              .catch((err) => {
                if (
                  err.message ===
                  `You are attempting to graduate a source that references unavailable fields. Source ${Colors.source(
                    'sitemap test'
                  )} requires the following field(s): anothernewfield, lastrebuilddate`
                ) {
                  done();
                } else {
                  done(err);
                }
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should have nothing to graduate', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const orgy: Organization = new TestOrganization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [])
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, [])
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, []);

        const diffOptions: IDiffOptions = {};
        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {},
        };
        controllerxy
          .runDiffSequence(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(0);
            expect(diff.TO_UPDATE.length).to.eql(0);
            expect(diff.TO_DELETE.length).to.eql(0);
            controllerxy
              .runGraduateSequence(diff, graduateOptions)
              .then((resolved: any[]) => {
                done();
              })
              .catch((err: any) => {
                done(err);
              });
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });
    });

    describe('Download Method', () => {
      it('Should download sources', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const controllerxy = new SourceController(orgx);

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources)
          .get('/rest/organizations/dev/sources/rrbbidfxa2ri4usxhzzmhq2hge-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVrrbbidfxa2ri4usxhzzmhq2hge)
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          .get('/rest/organizations/dev/sources/wyowilfyrpf2qogxm45uhgskri-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVwyowilfyrpf2qogxm45uhgskri)
          .get('/rest/organizations/dev/sources/qtngyd2gvxjxrrkftndaepcngu-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVqtngyd2gvxjxrrkftndaepcngu);

        controllerxy
          .runDownloadSequence()
          .then((downloadResultArray: DownloadResultArray) => {
            expect(downloadResultArray.getCount()).to.be.eql(4);
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should not download if server error', (done: Mocha.Done) => {
        const orgx: Organization = new TestOrganization('dev', 'xxx');
        const controllerxy = new SourceController(orgx);

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources)
          .get('/rest/organizations/dev/sources/rrbbidfxa2ri4usxhzzmhq2hge-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVrrbbidfxa2ri4usxhzzmhq2hge)
          .get('/rest/organizations/dev/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVtcytrppteddiqkmboszu4skdoe)
          .get('/rest/organizations/dev/sources/wyowilfyrpf2qogxm45uhgskri-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, DEVwyowilfyrpf2qogxm45uhgskri)
          .get('/rest/organizations/dev/sources/qtngyd2gvxjxrrkftndaepcngu-dummygroupk5f2dpwl/raw')
          .reply(429, { message: 'Too many requests' });

        controllerxy
          .runDownloadSequence()
          .then(() => {
            done('Should not resolve');
          })
          .catch((err: IGenericError) => {
            expect(JSON.parse(err.message)).to.eql({ message: 'Too many requests' });
            done();
          });
      });
    });
  });
};
