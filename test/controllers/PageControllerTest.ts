// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as nock from 'nock';
import * as _ from 'underscore';
import { Utils } from '../../src/commons/utils/Utils';
import { Organization } from '../../src/coveoObjects/Organization';
import { PageController } from '../../src/controllers/PageController';
import { UrlService } from '../../src/commons/rest/UrlService';
import { RequestUtils } from '../../src/commons/utils/RequestUtils';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { Page } from '../../src/coveoObjects/Page';
import { IGenericError } from '../../src/commons/errors';
import { IGraduateOptions } from '../../src/commands/GraduateCommand';
import { IDiffOptions } from '../../src/commands/DiffCommand';

export const PageControllerTest = () => {
  // Dev
  const DEVhighlyCustomized: {} = require('./../mocks/setup1/pages/dev/highlyCustomizedPage.json');
  const DEVproManagerPortalSearch: {} = require('./../mocks/setup1/pages/dev/ProManagePortalSearch.json');
  const DEVemptyPage: {} = require('./../mocks/setup1/pages/dev/emptyPage.json');

  // Prod
  const PRODhighlyCustomized: {} = require('./../mocks/setup1/pages/prod/highlyCustomizedPage.json');
  const PRODproManagerPortalSearch: {} = require('./../mocks/setup1/pages/prod/ProManagePortalSearch.json');
  const PRODbrokenPage: {} = require('./../mocks/setup1/pages/prod/brokenPage.json');
  const PRODemptyPage: {} = require('./../mocks/setup1/pages/prod/emptyPage.json');

  describe('Page Controller', () => {
    // Organizations
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    // Controller
    const controller = new PageController(org1, org2);

    let scope: nock.Scope;

    afterEach(() => {
      if (Utils.exists(scope)) {
        expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
      }

      // Reset Orgs
      org1.clearPages();
      org2.clearPages();
    });

    after(() => {
      nock.cleanAll();
    });

    describe('Diff Method', () => {
      it('Should not return an empty diff result', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev pages
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVproManagerPortalSearch, DEVhighlyCustomized])
          // Fecthing all prod pages
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODhighlyCustomized, PRODproManagerPortalSearch]);

        const diffOptions: IDiffOptions = {
          includeOnly: ['html']
        };
        controller
          .diff(diffOptions)
          .then((diff: DiffResultArray<Page>) => {
            expect(diff.containsItems()).to.be.true;
            expect(diff.TO_CREATE.length).to.equal(0, 'Should have 0 new extensions');
            expect(diff.TO_UPDATE.length).to.equal(1, 'Should have 1 updated extension');
            expect(diff.TO_DELETE.length).to.equal(0, 'Should have no deleted extension');

            expect(diff.TO_UPDATE[0].getName()).to.equal('highly-customized');

            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should not load pages that have been blacklisted for the diff', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx', { pages: ['empty'] });
        const orgy: Organization = new Organization('prod', 'yyy', { pages: ['broken'] });
        const controllerxy = new PageController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVemptyPage, DEVhighlyCustomized, DEVproManagerPortalSearch])
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODhighlyCustomized, PRODproManagerPortalSearch, PRODbrokenPage]);

        const diffOptions: IDiffOptions = {
          includeOnly: ['html']
        };
        controllerxy
          .diff(diffOptions)
          .then((diff: DiffResultArray<Page>) => {
            // The diff should not have picked up the sources to create and to delete
            expect(diff.TO_CREATE.length).to.equal(0, 'Should have 0 new extensions');
            expect(diff.TO_UPDATE.length).to.equal(1, 'Should have 1 updated extension');
            expect(diff.TO_DELETE.length).to.equal(0, 'Should have 0 deleted extension');
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should  throw an error if throttled by the REST API', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch])
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.UNAUTHORIZED, { Message: 'Invalid access token.' });

        controller
          .diff()
          .then(() => {
            done('Should not resolve');
          })
          .catch((err: IGenericError) => {
            expect(JSON.parse(err.message)).to.eql({
              Message: 'Invalid access token.'
            });
            done();
          });
      });
    });

    describe('Download Method', () => {
      it('Should return an empty array of pages if the org has no pages', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, []);

        controller
          .download()
          .then(() => {
            expect(org1.getPages().getCount()).to.be.eql(0);
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should download some pages', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch]);

        controller
          .download()
          .then(() => {
            expect(org1.getPages().getCount()).to.be.eql(2);
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should catch an error if too many request', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/pages')
          .reply(429, 'SOOOORRY'); // Too many requests

        controller
          .download()
          .then(() => {
            done('Should not resolve');
          })
          .catch((err: IGenericError) => {
            // We are expecting an error
            expect(err.message).to.eql('"SOOOORRY"');
            done();
          });
      });
    });

    describe('Graduate Method', () => {
      it('Should do not graduate anything', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev pages
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVemptyPage])
          // Fecthing all prod pages
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODemptyPage]);

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: false,
          DELETE: false,
          diffOptions: {}
        };

        controller
          .diff()
          .then((diffResultArray: DiffResultArray<Page>) => {
            // Nothing to graduate
            expect(diffResultArray.containsItems()).to.be.false;
            controller
              .graduate(diffResultArray, graduateOptions)
              .then(res => {
                expect(res).length.to.be.empty;
                done();
              })
              .catch((err: any) => {
                done(err);
              });
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should NOT graduate pages if "too many requests" error', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev pages
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch, DEVemptyPage])
          // Fecthing all prod pages
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODhighlyCustomized, PRODproManagerPortalSearch, PRODbrokenPage])
          .post('/rest/organizations/prod/pages', {
            title: (DEVemptyPage as any).title,
            name: (DEVemptyPage as any).name,
            html: (DEVemptyPage as any).html
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .put('/rest/organizations/prod/pages/66b7e0e6-f067-482c-9563-accbe20f17cd', {
            title: (DEVhighlyCustomized as any).title,
            name: (DEVhighlyCustomized as any).name,
            html: (DEVhighlyCustomized as any).html
          })
          .reply(429, 'TOO_MANY_REQUESTS')
          .delete('/rest/organizations/prod/pages/2b34dc4a-5411-4606-9f93-03c27ca89e7a')
          .reply(429, 'TOO_MANY_REQUESTS');

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {}
        };

        controller
          .diff()
          .then((diffResultArray: DiffResultArray<Page>) => {
            controller
              .graduate(diffResultArray, graduateOptions)
              .then((resolved: any[]) => {
                done('Should not resolve');
              })
              .catch((err: any) => {
                expect(err).to.eql('"TOO_MANY_REQUESTS"');
                done();
              });
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should graduate pages (POST, PUT, DELETE)', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev pages
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch, DEVemptyPage])
          // Fecthing all prod pages
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODhighlyCustomized, PRODproManagerPortalSearch, PRODbrokenPage])
          .post('/rest/organizations/prod/pages', {
            title: (DEVemptyPage as any).title,
            name: (DEVemptyPage as any).name,
            html: (DEVemptyPage as any).html
          })
          .reply(RequestUtils.OK)
          .put('/rest/organizations/prod/pages/66b7e0e6-f067-482c-9563-accbe20f17cd', {
            title: (DEVhighlyCustomized as any).title,
            name: (DEVhighlyCustomized as any).name,
            html: (DEVhighlyCustomized as any).html
          })
          .reply(RequestUtils.NO_CONTENT)
          .delete('/rest/organizations/prod/pages/2b34dc4a-5411-4606-9f93-03c27ca89e7a')
          .reply(RequestUtils.NO_CONTENT);

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {}
        };

        controller
          .diff()
          .then((diffResultArray: DiffResultArray<Page>) => {
            controller
              .graduate(diffResultArray, graduateOptions)
              .then(() => {
                done();
              })
              .catch((err: any) => {
                done(err);
              });
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should not graduate pages: Graduation error', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev pages
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch, DEVemptyPage])
          // Fecthing all prod pages
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.ACCESS_DENIED, { message: 'something went wrong' });

        controller
          .diff()
          .then(() => {
            done('Should not resolve');
          })
          .catch((err: IGenericError) => {
            expect(JSON.parse(err.message)).to.eql({
              message: 'something went wrong'
            });
            done();
          });
      });

      it('Should have nothing to graduate: No HTTP verbe selected', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/pages')
          .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch, DEVemptyPage])
          .get('/rest/organizations/prod/pages')
          .reply(RequestUtils.OK, [PRODhighlyCustomized, PRODproManagerPortalSearch, PRODbrokenPage]);

        const graduateOptions: IGraduateOptions = {
          POST: false,
          PUT: false,
          DELETE: false,
          diffOptions: {}
        };

        controller.diff().then((diffResultArray: DiffResultArray<Page>) => {
          controller
            .graduate(diffResultArray, graduateOptions)
            .then(() => {
              done();
            })
            .catch((err: any) => {
              done(err);
            });
        });
      });
    });
  });
};
