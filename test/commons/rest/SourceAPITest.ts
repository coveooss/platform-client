// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import * as nock from 'nock';
import { IGenericError } from '../../../src/commons/errors';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { SourceAPI } from '../../../src/commons/rest/SourceAPI';

export const SourceAPITest = () => {
  describe('Source API', () => {
    let scope: nock.Scope;

    const allSources = [
      {
        sourceType: 'SITEMAP',
        id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
        name: 'sitemaptest',
        owner: 'user@coveo.com-google',
        sourceVisibility: 'PRIVATE',
        information: {
          sourceStatus: {
            type: 'DISABLED',
            allowedOperations: ['DELETE', 'REBUILD']
          },
          rebuildRequired: true,
          numberOfDocuments: 0,
          documentsTotalSize: 0
        },
        pushEnabled: false,
        onPremisesEnabled: false,
        preConversionExtensions: [],
        postConversionExtensions: [
          {
            actionOnError: 'SKIP_EXTENSION',
            condition: '',
            extensionId: 'cclidev2l78wr0o-syolr7vxllz44qe6l4lcfpsklu',
            parameters: {},
            versionId: ''
          }
        ],
        permissions: {
          permissionLevels: [
            {
              name: 'Source Specified Permissions',
              permissionSets: [
                {
                  name: 'Private',
                  permissions: [
                    {
                      allowed: true,
                      identityType: 'USER',
                      identity: 'user@coveo.com',
                      securityProvider: 'Email Security Provider'
                    }
                  ]
                }
              ]
            }
          ]
        },
        urlFilters: [
          {
            filter: '*',
            includeFilter: true,
            filterType: 'WILDCARD'
          }
        ],
        resourceId: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74'
      },
      {
        sourceType: 'YOUTUBE',
        id: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq',
        name: 'youtube test',
        owner: 'user@coveo.com-google',
        sourceVisibility: 'SHARED',
        information: {
          sourceStatus: {
            type: 'DISABLED',
            allowedOperations: ['DELETE', 'REBUILD']
          },
          rebuildRequired: true,
          numberOfDocuments: 0,
          documentsTotalSize: 0
        },
        pushEnabled: false,
        onPremisesEnabled: false,
        preConversionExtensions: [],
        postConversionExtensions: [],
        urlFilters: [
          {
            filter: '*',
            includeFilter: true,
            filterType: 'WILDCARD'
          }
        ],
        resourceId: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq'
      }
    ];

    const ur4el4nwejfvpghipsvvs32m74 = {
      sourceType: 'SITEMAP',
      id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
      name: 'sitemaptest',
      owner: 'user@coveo.com-google',
      sourceVisibility: 'PRIVATE',
      mappings: [
        {
          id: 'vec6n33ff6b2jx7pdzosw6sbve',
          kind: 'COMMON',
          fieldName: 'mobilephone',
          extractionMethod: 'METADATA',
          content: '%[mobile]'
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
      pushEnabled: false,
      onPremisesEnabled: false,
      preConversionExtensions: [],
      postConversionExtensions: [
        {
          actionOnError: 'SKIP_EXTENSION',
          condition: '',
          extensionId: 'cclidev2l78wr0o-syolr7vxllz44qe6l4lcfpsklu',
          parameters: {},
          versionId: ''
        }
      ],
      permissions: {
        permissionLevels: [
          {
            name: 'Source Specified Permissions',
            permissionSets: [
              {
                name: 'Private',
                permissions: [
                  {
                    allowed: true,
                    identityType: 'USER',
                    identity: 'user@coveo.com',
                    securityProvider: 'Email Security Provider'
                  }
                ]
              }
            ]
          }
        ]
      },
      urlFilters: [
        {
          filter: '*',
          includeFilter: true,
          filterType: 'WILDCARD'
        }
      ],
      username: 'megatron',
      urls: ['http://test.com'],
      userAgent: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) (compatible; Coveobot/2.0;+http://www.coveo.com/bot.html)',
      enableJavaScript: true,
      javaScriptLoadingDelayInMilliseconds: 0,
      requestsTimeoutInSeconds: 100,
      scrapingConfiguration:
        '[\n  {\n    "for": {\n    "urls": [".*"]\n    },\n    "exclude": [\n      {\n        "type": "CSS",\n        "path": "body header"\n      },\n      {\n        "type": "CSS",\n        "path": "#herobox"\n      },\n      {\n        "type": "CSS",\n        "path": "#mainbar .everyonelovesstackoverflow"\n      },\n      {\n        "type": "CSS",\n        "path": "#sidebar"\n      },\n      {\n        "type": "CSS",\n        "path": "#footer"\n      },\n      {\n        "type": "CSS",\n        "path": "#answers"\n      }\n    ],\n    "metadata": {\n      "askeddate":{\n        "type": "CSS",\n        "path": "div#sidebar table#qinfo p::attr(title)"\n      },\n      "upvotecount": {\n        "type": "XPATH",\n        "path": "//div[@id=\'question\'] //span[@itemprop=\'upvoteCount\']/text()"\n      },\n      "author":{\n        "type": "CSS",\n        "path": "td.post-signature.owner div.user-details a::text"\n      }\n    },\n    "subItems": {\n      "answer": {\n        "type": "css",\n        "path": "#answers div.answer"\n      }\n    }\n  }, {\n    "for": {\n      "types": ["answer"]\n    },\n    "metadata": {\n      "upvotecount": {\n        "type": "XPATH",\n        "path": "//span[@itemprop=\'upvoteCount\']/text()"\n      },\n      "author": {\n        "type": "CSS",\n        "path": "td.post-signature:last-of-type div.user-details a::text"\n      }\n    }\n  }\n]',
      resourceId: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74'
    };

    const uwfuop2jp2hdvo5ao7abjlsgyq = {
      sourceType: 'YOUTUBE',
      id: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq',
      name: 'youtube test',
      owner: 'user@coveo.com-google',
      sourceVisibility: 'SHARED',
      mappings: [
        {
          id: 'vxmnzryqjok5thqalcyyyekpsa',
          kind: 'COMMON',
          fieldName: 'ytplaylistitemstitle',
          extractionMethod: 'METADATA',
          content: '%[coveo_PlaylistItemsTitle]'
        },
        {
          id: 'w2j6ztwrrdu7aun6inmjce2nvu',
          kind: 'COMMON',
          fieldName: 'ytvideodefinition',
          extractionMethod: 'METADATA',
          content: '%[coveo_VideoDefinition]'
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
      pushEnabled: false,
      onPremisesEnabled: false,
      preConversionExtensions: [],
      postConversionExtensions: [],
      urlFilters: [
        {
          filter: '*',
          includeFilter: true,
          filterType: 'WILDCARD'
        }
      ],
      urls: ['https://www.youtube.com/dummy'],
      indexPlaylists: false,
      resourceId: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq'
    };
    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    describe('Get all sources', () => {
      it('Should prepare the request to get all the sources of an organization', (done: MochaDone) => {
        const organization: Organization = new Organization('mydevorg', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/mydevorg/sources')
          .reply(RequestUtils.OK);

        SourceAPI.getAllSources(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error because of an invalid organization', () => {
        expect(() => SourceAPI.getAllSources(undefined)).to.throw();
      });
    });

    describe('Get Single source', () => {
      it('Should prepare the request to get a specific source of an organization', (done: MochaDone) => {
        const organization: Organization = new Organization('mydevorg', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/mydevorg/sources/mysitemapsource')
          .reply(RequestUtils.OK);

        SourceAPI.getSingleSource(organization, 'mysitemapsource')
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error because of an undefined extension id', () => {
        const organization: Organization = new Organization('mydevorg', 'secret');
        expect(() => SourceAPI.getSingleSource(organization, undefined)).to.throw();
      });
    });

    it('Should prepare the request to create a source', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .post('/rest/organizations/qwerty123/sources?rebuild=false', {
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
              content: '%[workemail]'
            }
          ],
          pushEnabled: false,
          postConversionExtensions: [
            {
              actionOnError: 'SKIP_EXTENSION',
              condition: '',
              extensionId: 'cclidevwcty5v1g-xsib6p54yjm37lagma3qvp2aji',
              parameters: {},
              versionId: ''
            }
          ],
          urlFilters: [
            {
              filter: '*',
              includeFilter: true,
              filterType: 'WILDCARD'
            }
          ]
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
            content: '%[workemail]'
          }
        ],
        pushEnabled: false,
        postConversionExtensions: [
          {
            actionOnError: 'SKIP_EXTENSION',
            condition: '',
            extensionId: 'cclidevwcty5v1g-xsib6p54yjm37lagma3qvp2aji',
            parameters: {},
            versionId: ''
          }
        ],
        urlFilters: [
          {
            filter: '*',
            includeFilter: true,
            filterType: 'WILDCARD'
          }
        ]
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to update a source', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .put('/rest/organizations/qwerty123/sources/cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey?rebuild=false', {
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
              content: '%[workemail]'
            }
          ]
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
            fieldName: 'workemail',
            content: '%[workemail]'
          }
        ]
      })
        .then(() => done())
        .catch((err: any) => done(err));
    });

    it('Should prepare the request to delete a source', (done: MochaDone) => {
      const organization: Organization = new Organization('qwerty123', 'secret');

      scope = nock(UrlService.getDefaultUrl())
        .delete('/rest/organizations/qwerty123/sources/cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey')
        .reply(RequestUtils.CREATED);

      SourceAPI.deleteSource(organization, 'cclidevwcty5v1g-tl2nzqb76il5y3zlsgp4r72aey')
        .then(() => done())
        .catch((err: any) => done(err));
    });

    describe('Loading sources', () => {
      it('Should prepare the request sequence that will load all the sources', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/sources')
          .reply(RequestUtils.OK, allSources)
          // Second expected request
          .get('/rest/organizations/qwerty123/sources/cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74')
          .reply(RequestUtils.OK, ur4el4nwejfvpghipsvvs32m74)
          .get('/rest/organizations/qwerty123/sources/cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq')
          .reply(RequestUtils.OK, uwfuop2jp2hdvo5ao7abjlsgyq);

        SourceAPI.loadSources(organization)
          .then(() => done())
          .catch((err: any) => done(err));
      });

      it('Should throw an error if unexpected response', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/qwerty123/sources')
          .reply(RequestUtils.OK, allSources)
          // Second expected request
          .get('/rest/organizations/qwerty123/sources/cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74')
          .reply(RequestUtils.OK, ur4el4nwejfvpghipsvvs32m74)
          .get('/rest/organizations/qwerty123/sources/cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq')
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

      it('Should throw an error if access denied', (done: MochaDone) => {
        const organization: Organization = new Organization('qwerty123', 'secret');

        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/qwerty123/sources')
          .reply(RequestUtils.ACCESS_DENIED);

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
