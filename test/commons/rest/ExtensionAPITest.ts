// tslint:disable:no-magic-numbers
import * as nock from 'nock';
import { expect, assert } from 'chai';
import { ExtensionAPI } from './../../../src/commons/rest/ExtensionAPI';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { IGenericError, StaticErrorMessage } from '../../../src/commons/errors';

export const ExtensionAPITest = () => {
  describe('Extension API', () => {
    let scope: nock.Scope;

    const simpleExtensionModel = {
      content: 'import urlparse\n\nprint "Hello Word"',
      description: 'This is an extension that prints an "Hello Word"',
      name: 'Hello Word',
      requiredDataStreams: []
    };

    const yidmuo9dsuop8fuihmfdjshjd = {
      id: 'yidmuo9dsuop8fuihmfdjshjd',
      content:
        'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    };

    const sa2fjv3lwf67va2pbiztb22fsu = {
      id: 'sa2fjv3lwf67va2pbiztb22fsu',
      content:
        'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    };

    const tknepx33tdhmqibch2uzxhcc44 = {
      id: 'tknepx33tdhmqibch2uzxhcc44',
      content:
        '# Title: Reject a document.\n# Description: This extension simply rejects a document.\n# Description: It gets triggered on certain file types in the source configuration\n# Required data: \n\ndocument_api.v1.reject()\n',
      description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
      name: 'Reject a document.',
      requiredDataStreams: ['BODY_TEXT']
    };

    const organizationExtension = [
      {
        createdDate: 1511812769000,
        description: '',
        enabled: true,
        id: 'yidmuo9dsuop8fuihmfdjshjd',
        lastModified: 1511812769000,
        name: 'All metadata value',
        requiredDataStreams: [],
        versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX',
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
      },
      {
        createdDate: 1511812769000,
        description: 'This extension is used to parse urls to extract metadata like categories.',
        enabled: true,
        id: 'sa2fjv3lwf67va2pbiztb22fsu',
        lastModified: 1511812769000,
        name: 'URL Parsing to extract metadata',
        requiredDataStreams: [],
        versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX',
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
      },
      {
        createdDate: 1511812764000,
        description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
        enabled: true,
        id: 'tknepx33tdhmqibch2uzxhcc44',
        lastModified: 1511812764000,
        name: 'Reject a document.',
        requiredDataStreams: [],
        versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
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
      }
    ];

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

    describe('Loading Extension', () => {
      it('Should prepare the request sequence that will load all the extensions', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/extensions')
          .reply(RequestUtils.OK, organizationExtension)
          // Second expected request
          .get('/rest/organizations/qwerty123/extensions/yidmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, yidmuo9dsuop8fuihmfdjshjd)
          .get('/rest/organizations/qwerty123/extensions/sa2fjv3lwf67va2pbiztb22fsu')
          .reply(RequestUtils.OK, sa2fjv3lwf67va2pbiztb22fsu)
          .get('/rest/organizations/qwerty123/extensions/tknepx33tdhmqibch2uzxhcc44')
          .reply(RequestUtils.OK, tknepx33tdhmqibch2uzxhcc44);

        ExtensionAPI.loadExtensions(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error if unexpected response', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/extensions')
          .reply(RequestUtils.OK, organizationExtension)
          // Second expected request
          .get('/rest/organizations/qwerty123/extensions/yidmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, 'some random object');

        ExtensionAPI.loadExtensions(organization)
          .then(() => {
            done('This function should not resolve');
          })
          .catch((err: IGenericError) => {
            assert.throws(() => {
              throw Error(err.message);
            });
            done();
          });
      });

      it('Should throw an error if access denied', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/qwerty123/extensions')
          .reply(RequestUtils.ACCESS_DENIED);

        ExtensionAPI.loadExtensions(organization)
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
