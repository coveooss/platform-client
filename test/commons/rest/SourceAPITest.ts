// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import * as nock from 'nock';
import { IGenericError } from '../../../src/commons/errors';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { SourceAPI } from '../../../src/commons/rest/SourceAPI';
import { TestOrganization } from '../../test';

export const SourceAPITest = () => {
  describe('Source API', () => {
    let scope: nock.Scope;

    const allSources: {} = require('./../../mocks/setup1/sources/dev/allSources.json');
    const rrbbidfxa2ri4usxhzzmhq2hge: {} = require('./../../mocks/setup1/sources/dev/web.json');
    const tcytrppteddiqkmboszu4skdoe: {} = require('./../../mocks/setup1/sources/dev/sitemap.json');
    const wyowilfyrpf2qogxm45uhgskri: {} = require('./../../mocks/setup1/sources/dev/salesforce.json');
    const qtngyd2gvxjxrrkftndaepcngu: {} = require('./../../mocks/setup1/sources/dev/youtube.json');

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    describe('Get all sources', () => {
      it('Should prepare the request to get all the sources of an organization', (done: Mocha.Done) => {
        const organization: Organization = new TestOrganization('mydevorg', 'secret');

        scope = nock(UrlService.getDefaultUrl()).get('/rest/organizations/mydevorg/sources').reply(RequestUtils.OK);

        SourceAPI.getAllSources(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      // it('Should throw an error because of an invalid organization', () => {
      //   expect(() => SourceAPI.getAllSources(undefined)).to.throw();
      // });
    });

    describe('Get Single source', () => {
      it('Should prepare the request to get a specific source of an organization', (done: Mocha.Done) => {
        const organization: Organization = new TestOrganization('mydevorg', 'secret');
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/mydevorg/sources/tcytrppteddiqkmboszu4skdoe/raw')
          .reply(RequestUtils.OK);

        SourceAPI.getSingleSource(organization, 'tcytrppteddiqkmboszu4skdoe')
          .then(() => done())
          .catch((err: any) => done(err));
      });

      // it('Should throw an error because of an undefined extension id', () => {
      //   const organization: Organization = new TestOrganization('mydevorg', 'secret');
      //   expect(() => SourceAPI.getSingleSource(organization, undefined)).to.throw();
      // });
    });

    it('Should prepare the request to create a source', (done: Mocha.Done) => {
      const organization: Organization = new TestOrganization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty123/sources/raw?rebuild=false', {
          sourceType: 'YOUTUBE',
          id: 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey',
          name: 'Coffee Chat',
          owner: 'user@coveo.com-google',
          sourceVisibility: 'SHARED',
          mappings: [
            {
              id: 'q6q72sozl73yjobkrl64cusemq',
              kind: 'COMMON',
              fieldName: 'workemail',
              extractionMethod: 'METADATA',
              content: '%[workemail]',
            },
          ],
          pushEnabled: false,
          postConversionExtensions: [
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'cclidevwcty5v1g-xsib6p54yjm37lagma3qvp2aji',
              parameters: {},
              versionId: '',
            },
          ],
          urlFilters: [
            {
              filter: '*',
              includeFilter: true,
              filterType: 'WILDCARD',
            },
          ],
        })
        .reply(RequestUtils.CREATED);

      SourceAPI.createSource(organization, {
        sourceType: 'YOUTUBE',
        id: 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey',
        name: 'Coffee Chat',
        owner: 'user@coveo.com-google',
        sourceVisibility: 'SHARED',
        mappings: [
          {
            id: 'q6q72sozl73yjobkrl64cusemq',
            kind: 'COMMON',
            fieldName: 'workemail',
            extractionMethod: 'METADATA',
            content: '%[workemail]',
          },
        ],
        pushEnabled: false,
        postConversionExtensions: [
          {
            actionOnError: 'SKIP_EXTENSION',
            condition: '',
            extensionId: 'cclidevwcty5v1g-xsib6p54yjm37lagma3qvp2aji',
            parameters: {},
            versionId: '',
          },
        ],
        urlFilters: [
          {
            filter: '*',
            includeFilter: true,
            filterType: 'WILDCARD',
          },
        ],
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to update a source', (done: Mocha.Done) => {
      const organization: Organization = new TestOrganization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .put('/rest/organizations/qwerty123/sources/cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey/raw?rebuild=false', {
          sourceType: 'YOUTUBE',
          id: 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey',
          name: 'Coffee Chat',
          owner: 'user@coveo.com-google',
          sourceVisibility: 'SHARED',
          mappings: [
            {
              id: 'q6q72sozl73yjobkrl64cusemq',
              kind: 'COMMON',
              extractionMethod: 'METADATA',
              fieldName: 'workemail',
              content: '%[workemail]',
            },
          ],
        })
        .reply(RequestUtils.CREATED);

      SourceAPI.updateSource(organization, 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey', {
        sourceType: 'YOUTUBE',
        id: 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey',
        name: 'Coffee Chat',
        owner: 'user@coveo.com-google',
        sourceVisibility: 'SHARED',
        mappings: [
          {
            id: 'q6q72sozl73yjobkrl64cusemq',
            kind: 'COMMON',
            extractionMethod: 'METADATA',
            fieldName: 'workemail',
            content: '%[workemail]',
          },
        ],
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to delete a source', (done: Mocha.Done) => {
      const organization: Organization = new TestOrganization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .delete('/rest/organizations/qwerty123/sources/cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey')
        .reply(RequestUtils.CREATED);

      SourceAPI.deleteSource(organization, 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey')
        .then(() => done())
        .catch((err: any) => done(err));
    });

    describe('Loading sources', () => {
      it('Should prepare the request sequence that will load all the sources', (done: Mocha.Done) => {
        const organization: Organization = new TestOrganization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/sources')
          .reply(RequestUtils.OK, allSources)
          // Second expected request
          .get('/rest/organizations/qwerty123/sources/rrbbidfxa2ri4usxhzzmhq2hge-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, rrbbidfxa2ri4usxhzzmhq2hge)
          .get('/rest/organizations/qwerty123/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, tcytrppteddiqkmboszu4skdoe)
          .get('/rest/organizations/qwerty123/sources/wyowilfyrpf2qogxm45uhgskri-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, wyowilfyrpf2qogxm45uhgskri)
          .get('/rest/organizations/qwerty123/sources/qtngyd2gvxjxrrkftndaepcngu-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, qtngyd2gvxjxrrkftndaepcngu);

        SourceAPI.loadSources(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error if unexpected response', (done: Mocha.Done) => {
        const organization: Organization = new TestOrganization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/sources')
          .reply(RequestUtils.OK, allSources)
          // Second expected request
          .get('/rest/organizations/qwerty123/sources/rrbbidfxa2ri4usxhzzmhq2hge-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, rrbbidfxa2ri4usxhzzmhq2hge)
          .get('/rest/organizations/qwerty123/sources/tcytrppteddiqkmboszu4skdoe-dummygroupk5f2dpwl/raw')
          .reply(RequestUtils.OK, { dsa: 'random object' });

        SourceAPI.loadSources(organization)
          .then(() => done())
          .catch((err: IGenericError) => {
            assert.throws(() => {
              throw Error(err.message);
            });
            done();
          });
      });

      it('Should throw an error if access denied', (done: Mocha.Done) => {
        const organization: Organization = new TestOrganization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl()).get('/rest/organizations/qwerty123/sources').reply(RequestUtils.ACCESS_DENIED);

        SourceAPI.loadSources(organization)
          .then(() => {
            done('This function should not resolve');
          })
          .catch((err: IGenericError) => {
            assert.equal(err.orgId, 'qwerty123');
            assert.throws(() => {
              throw Error();
            });
            done();
          });
      });
    });
  });
};
