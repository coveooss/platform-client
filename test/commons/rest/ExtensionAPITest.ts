// tslint:disable:no-magic-numbers
import * as nock from 'nock';
import { expect, assert } from 'chai';
import { ExtensionAPI } from './../../../src/commons/rest/ExtensionAPI';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';

export const ExtensionAPITest = () => {
  describe('Extension API', () => {
    let scope: nock.Scope;

    const extensionModel = {
      content: 'import urlparse\n\nprint "Hello Word"',
      description: 'This is an extension that prints an "Hello Word"',
      name: 'Hello Word',
      requiredDataStreams: []
    };

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    describe('Get all extensions', () => {
      it('Should prepare the request to get all the extension of an organization', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/qwerty123/extensions')
          .reply(RequestUtils.OK);

        ExtensionAPI.getAllExtensions(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error because of an invalid organization', () => {
        const organization: Organization = new Organization('qwerty123', 'secret');
        expect(() => ExtensionAPI.getAllExtensions(undefined)).to.throw();
      });
    });

    describe('Get Single Extension', () => {
      it('Should prepare the request to get a specific extension of an organization', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/qwerty123/extensions/my-special-extension')
          .reply(RequestUtils.OK);

        ExtensionAPI.getSingleExtension(organization, 'my-special-extension')
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error because of an undefined extension id', () => {
        const organization: Organization = new Organization('qwerty123', 'secret');
        expect(() => ExtensionAPI.getSingleExtension(organization, undefined)).to.throw();
      });
    });

    it('Should prepare the request to create an extension', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty123/extensions', {
          content: 'import urlparse\n\nprint "Hello Word"',
          description: 'This is an extension that prints an "Hello Word"',
          name: 'Hello Word',
          requiredDataStreams: []
        })
        .reply(RequestUtils.CREATED);

      ExtensionAPI.createExtension(organization, {
        content: 'import urlparse\n\nprint "Hello Word"',
        description: 'This is an extension that prints an "Hello Word"',
        name: 'Hello Word',
        requiredDataStreams: []
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to update an extension', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .put('/rest/organizations/qwerty123/extensions/extension-to-update', {
          content: 'print "Hello Word!!"',
          description: 'This is an extension that prints an "Hello Word"',
          name: 'Hello Word',
          requiredDataStreams: []
        })
        .reply(RequestUtils.CREATED);

      ExtensionAPI.updateExtension(organization, 'extension-to-update', {
        content: 'print "Hello Word!!"',
        description: 'This is an extension that prints an "Hello Word"',
        name: 'Hello Word',
        requiredDataStreams: []
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to delete an extension', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .delete('/rest/organizations/qwerty123/extensions/extension-to-delete')
        .reply(RequestUtils.NO_CONTENT);

      ExtensionAPI.deleteExtension(organization, 'extension-to-delete')
        .then(() => done())
        .catch((err: any) => done(err));
    });
  });
};
