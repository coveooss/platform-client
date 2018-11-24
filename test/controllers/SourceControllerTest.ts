// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import * as nock from 'nock';
import * as _ from 'underscore';
import { IHTTPGraduateOptions } from '../../src/commands/GraduateCommand';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { IGenericError } from '../../src/commons/errors';
import { UrlService } from '../../src/commons/rest/UrlService';
import { RequestUtils } from '../../src/commons/utils/RequestUtils';
import { Utils } from '../../src/commons/utils/Utils';
import { Source } from '../../src/coveoObjects/Source';
import { Organization } from '../../src/coveoObjects/Organization';
import { SourceController } from './../../src/controllers/SourceController';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { Extension } from '../../src/coveoObjects/Extension';

const extension1: Extension = new Extension({
  content: 'random content',
  createdDate: 1511812769000,
  description: 'This extension is used to parse urls to extract metadata like categories.',
  enabled: true,
  id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
  lastModified: 1511812770000,
  name: 'URL Parsing to extract metadata',
  requiredDataStreams: [],
  versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX'
});

const extension2: Extension = new Extension({
  content: '# Title: Reject a document.\n# Description: This extension simply rejects a document.\n',
  createdDate: 1512812764000,
  description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
  enabled: true,
  id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
  lastModified: 1511812764000,
  name: 'Reject a document.',
  requiredDataStreams: [],
  versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i'
});

const extension3: Extension = new Extension({
  content: 'print "test"',
  createdDate: 1511322764000,
  description: 'An extension that prints "test"',
  enabled: false,
  id: 'ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3',
  lastModified: 1511812764000,
  name: 'Simply prints something',
  requiredDataStreams: [],
  versionId: 'a6LyFxJKLDKDK0dsDDDOabXcJWp05e1k'
});

const dummyExtension1: Extension = new Extension({
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx1',
  name: 'dummyExtension 1',
  requiredDataStreams: []
});

const dummyExtension2: Extension = new Extension({
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx2',
  name: 'dummyExtension 2',
  requiredDataStreams: []
});

const dummyExtension3: Extension = new Extension({
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx3',
  name: 'dummyExtension 3',
  requiredDataStreams: []
});

const source1: Source = new Source({
  id: 'rdsajkldjsakjdklsajh-sadsa9f',
  name: 'Sitemap Source',
  sourceType: 'SITEMAP',
  sourceSecurityOption: 'Specified',
  postConversionExtensions: [
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
      parameters: {},
      versionId: ''
    },
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
      parameters: {},
      versionId: ''
    },
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3',
      parameters: {},
      versionId: ''
    }
  ],
  preConversionExtensions: [],
  mappings: []
});

const source2: Source = new Source({
  id: 'rds9pdosjakkgop4kljh-lkasjdg',
  name: 'Web Source',
  sourceType: 'WEB',
  sourceSecurityOption: 'Specified',
  postConversionExtensions: [
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3',
      parameters: {},
      versionId: ''
    }
  ],
  preConversionExtensions: [],
  mappings: []
});

export const SourceControllerTest = () => {
  describe('Source Controller', () => {
    // Organizations
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    // Controller
    const controller = new SourceController(org1, org2);

    // let scope: nock.Scope;

    // Define variables here

    afterEach(() => {
      // if (Utils.exists(scope)) {
      //   expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
      // }

      // Reset Orgs
      org1.clearSources();
      org2.clearSources();
    });

    after(() => {
      nock.cleanAll();
    });

    describe('GetCleanVersion Method', () => {
      // TODO
    });

    describe('Diff Method', () => {
      it('Should replace extension Ids their according name', () => {
        const sourceController = new SourceController(org1, org2);
        const extensionDict: Dictionary<Extension> = new Dictionary({
          'URL Parsing to extract metadata': extension1, // in Source 1
          'Reject a document.': extension2, // in Source 1
          'dummyExtension 1': dummyExtension1,
          'Simply prints something': extension3, // in Source 2
          'dummyExtension 2': dummyExtension2,
          'dummyExtension 3': dummyExtension3
        });

        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1,
          'Web Source': source2
        });

        sourceController.replaceExtensionIdWithName(sourceDict, extensionDict);
        const _source1 = sourceDict.getItem('Sitemap Source');
        expect(_source1.getPostConversionExtensions()[0]['extensionId']).to.eq('URL Parsing to extract metadata');
        expect(_source1.getPostConversionExtensions()[1]['extensionId']).to.eq('Reject a document.');
        expect(_source1.getPostConversionExtensions()[2]['extensionId']).to.eq('Simply prints something');

        const _source2 = sourceDict.getItem('Web Source');
        expect(_source2.getPostConversionExtensions()[0]['extensionId']).to.eq('Simply prints something');
      });
    });

    describe('Graduate Method', () => {
      // TODO
    });
  });
};
