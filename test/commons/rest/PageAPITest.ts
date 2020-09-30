// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as nock from 'nock';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { PageAPI } from './../../../src/commons/rest/PageAPI';

export const PageAPITest = () => {
  describe('Page API', () => {
    const DEVhighlyCustomized: {} = require('./../../mocks/setup1/pages/dev/highlyCustomizedPage.json');
    const DEVproManagerPortalSearch: {} = require('./../../mocks/setup1/pages/dev/ProManagePortalSearch.json');

    const samplePageModel = {
      name: 'sample-page',
      title: 'Sample Search Page',
      html: '<html>...</html>',
    };
    // const pageList = [];

    let scope: nock.Scope;

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    it('Should prepare the request to get all the pages', (done: Mocha.Done) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl()).get('/rest/organizations/qwerty123/pages').reply(RequestUtils.OK);

      PageAPI.getAllPages(organization)
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the 1 request to create a search page', (done: Mocha.Done) => {
      const organization: Organization = new Organization('qwerty456', 'secret');

      scope = nock(UrlService.getDefaultUrl()).post('/rest/organizations/qwerty456/pages', samplePageModel).reply(RequestUtils.OK);

      PageAPI.createPage(organization, JsonUtils.clone(samplePageModel))
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to update a search page', (done: Mocha.Done) => {
      const organization: Organization = new Organization('myorg', 'secret');

      const myPage = {
        name: 'sample-page',
        title: 'Sample Search Page',
        html: '<html>...</html>',
      };

      scope = nock(UrlService.getDefaultUrl()).put('/rest/organizations/myorg/pages/a123-b456', myPage).reply(RequestUtils.NO_CONTENT);

      PageAPI.updatePage(organization, 'a123-b456', JsonUtils.clone(myPage))
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to delete fields', (done: Mocha.Done) => {
      const organization: Organization = new Organization('myorg', 'secret');

      scope = nock(UrlService.getDefaultUrl()).delete('/rest/organizations/myorg/pages/x456-y789').reply(RequestUtils.NO_CONTENT);

      PageAPI.deletePage(organization, 'x456-y789')
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should load all pages from the organization', (done: Mocha.Done) => {
      const organization: Organization = new Organization('hjkmnbfjhj3gfde45', 'xxx-xxx');
      scope = nock(UrlService.getDefaultUrl())
        .get('/rest/organizations/hjkmnbfjhj3gfde45/pages')
        .reply(RequestUtils.OK, [DEVhighlyCustomized, DEVproManagerPortalSearch]);

      PageAPI.loadPages(organization)
        .then(() => {
          expect(organization.getPages().getCount()).to.eql(2);
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });
  });
};
