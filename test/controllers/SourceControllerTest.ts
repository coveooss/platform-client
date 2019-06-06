import * as jsDiff from 'diff';
// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as _ from 'underscore';
import * as nock from 'nock';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { IGenericError } from '../../src/commons/errors';
import { UrlService } from '../../src/commons/rest/UrlService';
import { RequestUtils } from '../../src/commons/utils/RequestUtils';
import { Utils } from '../../src/commons/utils/Utils';
import { Source } from '../../src/coveoObjects/Source';
import { Organization } from '../../src/coveoObjects/Organization';
import { SourceController } from './../../src/controllers/SourceController';
import { IDiffOptions } from '../../src/commands/DiffCommand';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { JsonUtils } from '../../src/commons/utils/JsonUtils';
import { IGraduateOptions } from '../../src/commands/GraduateCommand';

const allDevSources: Array<{}> = require('./../mocks/setup1/sources/dev/allSources.json');
// const DEVrrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../mocks/setup1/sources/dev/web.json');
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
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

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
          Salesforce: source2.clone() // Make a copy of the source
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku
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
        const org3 = new Organization('dev', 'xxx', { extensions: ['SharedVideosNormalization'] });
        const source1 = new Source(DEVtcytrppteddiqkmboszu4skdoe);
        const source2 = new Source(DEVwyowilfyrpf2qogxm45uhgskri);
        const sourceController = new SourceController(org3, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(), // Make a copy of the source
          Salesforce: source2.clone() // Make a copy of the source
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku
        ];

        expect(sourceDict.getItem('Sitemap Source').getPostConversionExtensions().length).to.eql(2);
        // First, replace extension IDs with their respective name
        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        // Now, remove blacklisted extensions
        sourceController.removeExtensionFromOriginSource(sourceDict);
        expect(sourceDict.getItem('Sitemap Source').getPostConversionExtensions().length).to.eql(1);
      });

      it('Should remove any obejct from the source configuration', () => {
        const salesforceSource = new Source(PRODwyowilfyrpf2qogxm45uhgskri);

        const keyWhitelist = [
          'logicalIndex',
          'postConversionExtensions',
          'preConversionExtensions',
          'configuration.addressPatterns',
          'configuration.parameters',
          'configuration.startingAddresses'
        ];

        const keyBlacklist = [
          'configuration.parameters.SourceId',
          'configuration.parameters.OrganizationId',
          'configuration.parameters.ClientSecret',
          'configuration.parameters.ClientId',
          'configuration.parameters.IsSandbox'
        ];

        salesforceSource.removeParameters(keyBlacklist, keyWhitelist);

        expect(salesforceSource.getConfiguration()).to.eql({
          configuration: {
            startingAddresses: ['http://www.salesforce.com'],
            addressPatterns: [{ expression: '*', patternType: 'Wildcard', allowed: true }],
            parameters: {
              PauseOnError: { sensitive: false, value: 'true' },
              SchemaVersion: { sensitive: false, value: 'LEGACY' },
              UseRefreshToken: { sensitive: false, value: 'true' }
            }
          },
          preConversionExtensions: [],
          postConversionExtensions: [
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'dummygroupproduction-sr3jny7s5ekuwuyaak45awcaku',
              parameters: {},
              versionId: ''
            },
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'dummygroupproduction-xnnutbu2n6kiwm243iossdsjha',
              parameters: {},
              versionId: ''
            }
          ],
          logicalIndex: 'default'
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
          Salesforce: source2Clone
        });
        const extensionList = [
          DEVukjs6nvyjvqdn4vozf3ugjkdqe,
          DEVsfm7yvhqtiftmfuasrqtpfkio4,
          DEVxnnutbu2n6kiwm243iossdsjha,
          DEVsr3jny7s5ekuwuyaak45awcaku
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
          'Sitemap Source': source1.clone()
        });

        expect(() => sourceController.replaceExtensionIdWithName(sourceDict, [])).to.throw();
        expect(() => sourceController.replaceExtensionNameWithId(source1.clone(), [])).to.throw();
      });
    });

    describe('Diff Method', () => {
      it('Should support item types mapping', (done: MochaDone) => {
        const devMappings = [
          {
            id: 'rasdf33sgh2evy',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'videotype',
            extractionMethod: 'LITERAL',
            content: 'playlist'
          },
          {
            id: 'rasdfgh2evy',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'body',
            extractionMethod: 'LITERAL',
            content: 'New body value'
          },
          {
            id: 'fdkjslfkdsf',
            kind: 'COMMON',
            fieldName: 'body',
            extractionMethod: 'METADATA',
            content: '%[description]'
          }
        ];
        const prodMapping = [
          {
            id: 'fd345yujkmjnhgfdd',
            kind: 'COMMON',
            fieldName: 'body',
            extractionMethod: 'METADATA',
            content: '%[description]'
          },
          {
            id: 'dsadsdsad',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'videotype',
            extractionMethod: 'LITERAL',
            content: 'playlist'
          },
          {
            id: 'wertghj',
            kind: 'MAPPING',
            type: 'Playlist',
            fieldName: 'body',
            extractionMethod: 'LITERAL',
            content: 'New body value'
          }
        ];

        const devSource = JsonUtils.clone(DEVtcytrppteddiqkmboszu4skdoe);
        devSource.mappings = devMappings;

        const prodSource = JsonUtils.clone(PRODtcytrppteddiqkmboszu4skdoe);
        prodSource.mappings = prodMapping;

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, _.where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
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
          .reply(RequestUtils.OK, _.where(allProdSources, { name: 'My Sitemap Source' }))
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          // Replace mappings
          .reply(RequestUtils.OK, prodSource);

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: ['mappings']
        };

        controller
          .diff(diffOptions)
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

      it('Extraction method should ignore id when diffing mappings and the mapping order', () => {
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
              content: 'playlist'
            },
            {
              id: 'rasdfgh2evy',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'body',
              extractionMethod: 'LITERAL',
              content: 'New body value'
            },
            {
              id: 'fdkjslfkdsf',
              kind: 'COMMON',
              fieldName: 'body',
              extractionMethod: 'METADATA',
              content: '%[description]'
            }
          ],
          sourceType: 'Dummy',
          preConversionExtensions: [],
          postConversionExtensions: []
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
              content: '%[description]'
            },
            {
              id: 'dsadsdsad',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'videotype',
              extractionMethod: 'LITERAL',
              content: 'playlist'
            },
            {
              id: 'wertghj',
              kind: 'MAPPING',
              type: 'Playlist',
              fieldName: 'body',
              extractionMethod: 'LITERAL',
              content: 'New body value'
            }
          ],
          sourceType: 'Dummy',
          preConversionExtensions: [],
          postConversionExtensions: []
        });

        const diffOptions: IDiffOptions = {
          includeOnly: ['mappings']
        };

        // These 2 function are being called in the source diff
        devSource.sortMappingsAndStripIds();
        prodSource.sortMappingsAndStripIds();

        const cleanVersion: any = controller.extractionMethod([devSource], diffOptions, [prodSource]);

        const diff: jsDiff.Change[] = cleanVersion[0].newSource;

        // The mapping arrays should be similar
        expect(diff.length).to.eq(1);
        expect(diff[0].added).to.not.exist;
        expect(diff[0].removed).to.not.exist;
      });

      it('Should diff sources (updated)', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, _.where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
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
          .reply(RequestUtils.OK, _.where(allProdSources, { name: 'My Sitemap Source' }))
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
          'configuration.startingAddresses'
        ];

        const keysToIgnore = [
          'configuration.parameters.SourceId',
          'configuration.parameters.OrganizationId',
          'configuration.parameters.ClientSecret',
          'configuration.parameters.ClientId',
          'configuration.parameters.IsSandbox',
          'resourceId'
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: includeOnly,
          keysToIgnore: keysToIgnore
        };

        controller
          .diff(diffOptions)
          .then((diffResultArray: DiffResultArray<Source>) => {
            expect(diffResultArray.TO_CREATE.length).to.eql(0);
            expect(diffResultArray.TO_UPDATE.length).to.eql(1);
            expect(diffResultArray.TO_DELETE.length).to.eql(0);

            // TODO: get clean version
            // throw new Error('To implement');
            const cleanVersion = controller.getCleanVersion(diffResultArray, diffOptions);

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

      it('Should diff sources (new - deleted)', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, _.where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
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
          .reply(RequestUtils.OK, _.where(allProdSources, { name: 'My web source' }))
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
          'configuration.startingAddresses'
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          includeOnly: keyWhitelist
        };

        controller
          .diff(diffOptions)
          .then((diffResultArray: DiffResultArray<Source>) => {
            expect(diffResultArray.TO_CREATE.length).to.eql(1);
            expect(diffResultArray.TO_UPDATE.length).to.eql(0);
            expect(diffResultArray.TO_DELETE.length).to.eql(1);

            const cleanVersion = controller.getCleanVersion(diffResultArray, diffOptions);

            expect(cleanVersion, "only Only print the souce's name if no modification was brought").to.eql({
              summary: {
                TO_CREATE: 1,
                TO_UPDATE: 0,
                TO_DELETE: 1
              },
              TO_CREATE: ['My Sitemap Source'],
              TO_UPDATE: [],
              TO_DELETE: ['My web source']
            });

            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should not load extensions that have been blacklisted on the source diff', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx', { extensions: ['SharedVideosNormalization', 'FilterVideos'] });
        const orgy: Organization = new Organization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, _.where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
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
          .reply(RequestUtils.OK, _.where(allProdSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          .get('/rest/organizations/prod/sources/tcytrppteddiqkmboszu4skdoe-dummygroupproduction/raw')
          .reply(RequestUtils.OK, PRODtcytrppteddiqkmboszu4skdoe);

        const diffOptions: IDiffOptions = { includeOnly: ['postConversionExtensions'] };
        controllerxy
          .diff(diffOptions)
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

      it('Should not load sources that have been blacklisted for the diff', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx', { sources: ['My web source'] });
        const orgy: Organization = new Organization('prod', 'yyy', { sources: ['My web source'] });
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
            DEVukjs6nvyjvqdn4vozf3ugjkdqe
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
          .diff(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            // We don't care about the diff result here. We just wan to make sure the Diff command ignored the blacklisted sources
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should take into account new and missing parameters in the source configuration', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx');
        const orgy: Organization = new Organization('prod', 'yyy');
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
              content: '%[printableuri]'
            }
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          parameterNotInProduction: 'dsa',
          resourceId: 'dev-source4'
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
              content: '%[printableuri]'
            }
          ],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source',
          enableJavaScript: false,
          javaScriptLoadingDelayInMilliseconds: 0,
          requestsTimeoutInSeconds: 100
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
          .diff(diffOptions)
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

    describe('GetCleanVersion Method', () => {
      it('Should return the clean diff version - empty', () => {
        const diffResultArray: DiffResultArray<Source> = new DiffResultArray();
        const cleanVersion = controller.getCleanVersion(diffResultArray, {});
        expect(cleanVersion).to.eql({
          summary: { TO_CREATE: 0, TO_UPDATE: 0, TO_DELETE: 0 },
          TO_CREATE: [],
          TO_UPDATE: [],
          TO_DELETE: []
        });
      });
    });

    describe('Graduate Method', () => {
      it('Should graduate using the blacklist strategy', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .post('/rest/organizations/prod/sources/raw?rebuild=false', {
            sourceType: 'SITEMAP',
            name: 'sitemaptest',
            mappings: [],
            preConversionExtensions: [],
            postConversionExtensions: []
          })
          .reply(RequestUtils.OK)
          .put('/rest/organizations/prod/sources/web-source-prod/raw?rebuild=false', {
            sourceType: 'WEB',
            name: 'My web source',
            mappings: [
              {
                id: 'q4qripnnvztvqempxtkvdb2cqa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]'
              }
            ],
            preConversionExtensions: [],
            postConversionExtensions: []
          })
          .reply(RequestUtils.OK)
          .delete('/rest/organizations/prod/sources/dev-source-to-delete')
          .reply(RequestUtils.OK);

        const extensionDiff: DiffResultArray<Source> = new DiffResultArray();
        extensionDiff.TO_CREATE = [
          new Source({
            sourceType: 'SITEMAP',
            id: 'dev-source',
            name: 'sitemaptest',
            mappings: [],
            information: {
              sourceStatus: {
                type: 'DISABLED',
                allowedOperations: ['DELETE', 'REBUILD']
              },
              rebuildRequired: true,
              numberOfDocuments: 0,
              documentsTotalSize: 0
            },
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'dev-source4'
          })
        ];
        extensionDiff.TO_UPDATE = [
          new Source({
            sourceType: 'WEB',
            id: 'web-source',
            name: 'My web source',
            mappings: [
              {
                id: 'q4qripnnvztvqempxtkvdb2cqa',
                kind: 'COMMON',
                fieldName: 'printableuri',
                extractionMethod: 'METADATA',
                content: '%[printableuri]'
              }
            ],
            information: {
              sourceStatus: {
                type: 'DISABLED',
                allowedOperations: ['DELETE', 'REBUILD']
              },
              rebuildRequired: true,
              numberOfDocuments: 0,
              documentsTotalSize: 0
            },
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'web-source'
          })
        ];
        extensionDiff.TO_UPDATE_OLD = [
          new Source({
            sourceType: 'WEB',
            id: 'web-source-prod',
            name: 'My web source',
            mappings: [],
            information: {
              sourceStatus: {
                type: 'DISABLED',
                allowedOperations: ['DELETE', 'REBUILD']
              },
              rebuildRequired: true,
              numberOfDocuments: 0,
              documentsTotalSize: 0
            },
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'web-source-prod'
          })
        ];
        extensionDiff.TO_DELETE = [
          new Source({
            sourceType: 'SITEMAP',
            id: 'dev-source-to-delete',
            name: 'source to delete',
            mappings: [],
            preConversionExtensions: [],
            postConversionExtensions: [],
            resourceId: 'dev-source-to-delete'
          })
        ];

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          keyBlacklist: ['information', 'resourceId', 'id', 'owner', 'securityProviderReferences'],
          diffOptions: {}
        };

        controller
          .graduate(extensionDiff, graduateOptions)
          .then((resolved: any[]) => {
            // expect(resolved).to.be.empty;
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      // it('Should graduate using the whitelist strategy', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });
    });
  });
};
