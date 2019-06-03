// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as _ from 'underscore';
import * as nock from 'nock';
// import { IGraduateOptions } from '../../src/commands/GraduateCommand';
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
// import { JsonUtils } from '../../src/commons/utils/JsonUtils';
// import { Dictionary } from '../../src/commons/collections/Dictionary';

const allDevSources: Array<{}> = require('./../mocks/setup1/sources/dev/allSources.json');
// const DEVrrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../mocks/setup1/sources/dev/web.json');
const DEVtcytrppteddiqkmboszu4skdoe: {} = require('./../mocks/setup1/sources/dev/sitemap.json');
const DEVwyowilfyrpf2qogxm45uhgskri: {} = require('./../mocks/setup1/sources/dev/salesforce.json');
// const DEVqtngyd2gvxjxrrkftndaepcngu: {} = require('./../mocks/setup1/sources/dev/youtube.json');

const allProdSources: Array<{}> = require('./../mocks/setup1/sources/prod/allSources.json');
const PRODrrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../mocks/setup1/sources/prod/web.json');
const PRODtcytrppteddiqkmboszu4skdoe: {} = require('./../mocks/setup1/sources/prod/sitemap.json');
const PRODwyowilfyrpf2qogxm45uhgskri: {} = require('./../mocks/setup1/sources/prod/salesforce.json');

// const allDevExtensions: {} = require('./../mocks/setup1/extensions/dev/allExtensions.json');
// const q32rkqp2fzuz2b3rbw5d53kc2q: {} = require('./../mocks/setup1/extensions/dev/q32rkqp2fzuz2b3rbw5d53kc2q.json'); // used by no sources
// const qww6e7om4rommwdba5nk3ykc4e: {} = require('./../mocks/setup1/extensions/dev/qww6e7om4rommwdba5nk3ykc4e.json'); // used by no sources
const sfm7yvhqtiftmfuasrqtpfkio4: {} = require('./../mocks/setup1/extensions/dev/sfm7yvhqtiftmfuasrqtpfkio4.json');
const sr3jny7s5ekuwuyaak45awcaku: {} = require('./../mocks/setup1/extensions/dev/sr3jny7s5ekuwuyaak45awcaku.json');
const ukjs6nvyjvqdn4vozf3ugjkdqe: {} = require('./../mocks/setup1/extensions/dev/ukjs6nvyjvqdn4vozf3ugjkdqe.json');
const xnnutbu2n6kiwm243iossdsjha: {} = require('./../mocks/setup1/extensions/dev/xnnutbu2n6kiwm243iossdsjha.json');
// const xuklmyqaujg3gj2ivcynor2adq: {} = require('./../mocks/setup1/extensions/dev/xuklmyqaujg3gj2ivcynor2adq.json');

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
          ukjs6nvyjvqdn4vozf3ugjkdqe,
          sfm7yvhqtiftmfuasrqtpfkio4,
          xnnutbu2n6kiwm243iossdsjha,
          sr3jny7s5ekuwuyaak45awcaku
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
          ukjs6nvyjvqdn4vozf3ugjkdqe,
          sfm7yvhqtiftmfuasrqtpfkio4,
          xnnutbu2n6kiwm243iossdsjha,
          sr3jny7s5ekuwuyaak45awcaku
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
          ukjs6nvyjvqdn4vozf3ugjkdqe,
          sfm7yvhqtiftmfuasrqtpfkio4,
          xnnutbu2n6kiwm243iossdsjha,
          sr3jny7s5ekuwuyaak45awcaku
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
      // it('Should support item types mapping', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });

      // it('Should ignore id when diffing mappings', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });

      // it('Should ignore order when diffing mapping', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });

      // it('Should ignore id when diffing object to get', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });

      // it('Should ignore order when diffing object to get', (done: MochaDone) => {
      //   throw new Error('To implement');
      // });

      it('Should diff sources (updated)', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, _.where(allDevSources, { name: 'My Sitemap Source' })) // Just picking the sitemap for this test
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [sfm7yvhqtiftmfuasrqtpfkio4, ukjs6nvyjvqdn4vozf3ugjkdqe])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [ukjs6nvyjvqdn4vozf3ugjkdqe])
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

            // console.log('*********************');
            // console.log(JsonUtils.stringify(cleanVersion));
            // console.log('*********************');

            // expect(cleanVersion).to.eql({
            //   configuration: {
            //     startingAddresses: {
            //       newValue: [
            //         'http://www.dummy.com/support/parts',
            //         'https://www.dummy.com/remote-controls',
            //         'https://www.dummy.com/accessories',
            //         'https://www.dummy.com/smartphone-control-products'
            //       ],
            //       oldValue: [
            //         'https://www.dummy.com/remote-controls',
            //         'https://www.dummy.com/accessories',
            //         'https://www.dummy.com/smartphone-control-products'
            //       ]
            //     }
            //   },
            //   postConversionExtensions: { newValue: [[Object], [Object]], oldValue: [[Object]] },
            //   mappings: 'Only print mappings that have changed'
            // });

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
          .reply(RequestUtils.OK, [sfm7yvhqtiftmfuasrqtpfkio4, ukjs6nvyjvqdn4vozf3ugjkdqe])
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

      // it('Should diff sources', (done: MochaDone) => {
      //   scope = nock(UrlService.getDefaultUrl())
      //     // First expected request
      //     .get('/rest/organizations/dev/sources')
      //     .reply(RequestUtils.OK, allDevSources)
      //     // Fecth extensions from dev
      //     .get('/rest/organizations/dev/extensions')
      //     .reply(RequestUtils.OK, [rawExtension1, rawExtension2, rawExtension3])
      //     // Fecth extensions from Prod
      //     .get('/rest/organizations/prod/extensions')
      //     // Rename extension Ids
      //     .reply(RequestUtils.OK, [rawExtension4])
      //     // Fetching dev sources one by one
      //     .get('/rest/organizations/dev/sources/cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74')
      //     .reply(RequestUtils.OK, ur4el4nwejfvpghipsvvs32m74)
      //     .get('/rest/organizations/dev/sources/cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq')
      //     .reply(RequestUtils.OK, uwfuop2jp2hdvo5ao7abjlsgyq)
      //     // Fecthing all prod sources
      //     .get('/rest/organizations/prod/sources')
      //     .reply(RequestUtils.OK, allProdSources)
      //     .get('/rest/organizations/prod/sources/ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4')
      //     .reply(RequestUtils.OK, xze6hjeidrpcborfhqk4vxkgy4);

      //   const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
      //   controller
      //     .diff(diffOptions)
      //     .then((diff: DiffResultArray<Source>) => {
      //       expect(diff.TO_CREATE.length).to.eql(1);
      //       expect(diff.TO_UPDATE.length).to.eql(1);
      //       expect(diff.TO_DELETE.length).to.eql(0);
      //       done();
      //     })
      //     .catch((err: IGenericError) => {
      //       done(err);
      //     });
      // });

      /*
      it('Should not load extensions that have been blacklisted on the source diff', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx', { extensions: ['URL Parsing to extract metadata'] });
        const orgy: Organization = new Organization('prod', 'yyy');
        const controllerxy = new SourceController(orgx, orgy);

        const localDevSource = {
          sourceType: 'SITEMAP',
          id: 'dev-source',
          name: 'sitemaptest',
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
              parameters: {},
              versionId: ''
            }
          ],
          resourceId: 'dev-source4'
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemaptest',
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source'
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [rawExtension1])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource])
          .get('/rest/organizations/prod/sources/prod-source')
          .reply(RequestUtils.OK, localProdSource);

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        controllerxy
          .diff(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
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
        const orgx: Organization = new Organization('dev', 'xxx', { sources: ['web test'] });
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
          resourceId: 'dev-source4'
        };

        const localDevSource2 = {
          sourceType: 'WEB',
          id: 'web-dev-source',
          name: 'web test',
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'dev-source4'
        };

        const localProdSource = {
          sourceType: 'SITEMAP',
          id: 'prod-source',
          name: 'sitemap test',
          mappings: [],
          preConversionExtensions: [],
          postConversionExtensions: [],
          resourceId: 'prod-source'
        };

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, [localDevSource, localDevSource2])
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [rawExtension1])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/dev-source')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource])
          .get('/rest/organizations/prod/sources/prod-source')
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
          .get('/rest/organizations/dev/sources/dev-source')
          .reply(RequestUtils.OK, localDevSource)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, [localProdSource])
          .get('/rest/organizations/prod/sources/prod-source')
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

      it('Should not have updated source in the diff', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources2)
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74')
          .reply(RequestUtils.OK, ur4el4nwejfvpghipsvvs32m74Copy)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, allProdSources2)
          .get('/rest/organizations/prod/sources/ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4')
          .reply(RequestUtils.OK, xze6hjeidrpcborfhqk4vxkgy4Copy);

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        controller
          .diff(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(0);
            expect(diff.TO_UPDATE.length).to.eql(0);
            expect(diff.TO_DELETE.length).to.eql(0);
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });
      */
    });

    describe('GetCleanVersion Method', () => {
      it('Should only return what have changed in the source', () => {
        throw new Error('To implement');
      });

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

      // it('Should return the clean diff version', () => {
      //   const diffResultArray: DiffResultArray<Source> = new DiffResultArray();
      //   diffResultArray.TO_CREATE.push(new Source(uwfuop2jp2hdvo5ao7abjlsgyq));
      //   diffResultArray.TO_UPDATE.push(new Source(ur4el4nwejfvpghipsvvs32m74));
      //   diffResultArray.TO_UPDATE_OLD.push(new Source(xze6hjeidrpcborfhqk4vxkgy4));

      //   const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
      //   const cleanVersion = controller.getCleanVersion(diffResultArray, diffOptions);

      //   const updatedSource = cleanVersion.TO_UPDATE[0];
      //   expect(updatedSource.id, 'Should not include the source id in the diff').to.not.have.keys('newValue', 'oldValue');
      //   expect(updatedSource.owner, 'Should not include the `owner` property in the diff').to.not.have.keys('newValue', 'oldValue');
      //   expect(updatedSource.resourceId, 'Should not include the `resourceId` property in the diff').to.not.have.keys(
      //     'newValue',
      //     'oldValue'
      //   );
      //   expect(updatedSource.information, 'Should not include the `information` property in the diff').to.not.have.keys(
      //     'newValue',
      //     'oldValue'
      //   );
      // });
    });

    /*
    describe('Graduate Method', () => {
      it('Should graduate using the blacklist strategy', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .post('/rest/organizations/prod/sources?rebuild=false', {
            sourceType: 'SITEMAP',
            name: 'sitemaptest',
            mappings: [],
            preConversionExtensions: [],
            postConversionExtensions: []
          })
          .reply(RequestUtils.OK)
          .put('/rest/organizations/prod/sources/web-source-prod?rebuild=false', {
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

      it('Should graduate using the whitelist strategy', (done: MochaDone) => {
        throw new Error('To implement');
      });
    });
    */
  });
};
