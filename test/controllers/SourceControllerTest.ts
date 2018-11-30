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

const rawExtension1 = {
  content: 'random content',
  createdDate: 1511812769000,
  description: 'This extension is used to parse urls to extract metadata like categories.',
  enabled: true,
  id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
  lastModified: 1511812770000,
  name: 'URL Parsing to extract metadata',
  requiredDataStreams: [],
  versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX'
};

const rawExtension2 = {
  content: '# Title: Reject a document.\n# Description: This extension simply rejects a document.\n',
  createdDate: 1512812764000,
  description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
  enabled: true,
  id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
  lastModified: 1511812764000,
  name: 'Reject a document.',
  requiredDataStreams: [],
  versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i'
};

const rawExtension3 = {
  content: 'print "test"',
  createdDate: 1511322764000,
  description: 'An extension that prints "test"',
  enabled: false,
  id: 'ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3',
  lastModified: 1511812764000,
  name: 'Simply prints something',
  requiredDataStreams: [],
  versionId: 'a6LyFxJKLDKDK0dsDDDOabXcJWp05e1k'
};

const rawExtension4 = {
  content: 'Production extension',
  createdDate: 1511322764000,
  description: 'An extension for the production',
  enabled: false,
  id: 'ccliprodozvzoaua-vvdaravex2tqdt5npreoz2clgu',
  lastModified: 1511812764000,
  name: 'Simply prints something',
  requiredDataStreams: [],
  versionId: 'a6LyFxJKLDKDK0dsDDDOabXcJWp05e1k'
};

const rawDummyExtension1 = {
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx1',
  name: 'dummyExtension 1',
  requiredDataStreams: []
};

const rawDummyExtension2 = {
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx2',
  name: 'dummyExtension 2',
  requiredDataStreams: []
};

const rawDummyExtension3 = {
  content: 'dummy',
  description: 'An extension that prints "test"',
  id: 'dummy-xx3',
  name: 'dummyExtension 3',
  requiredDataStreams: []
};

const extension1: Extension = new Extension(rawExtension1);
const extension2: Extension = new Extension(rawExtension2);
const extension3: Extension = new Extension(rawExtension3);
const dummyExtension1: Extension = new Extension(rawDummyExtension1);
const dummyExtension2: Extension = new Extension(rawDummyExtension2);
const dummyExtension3: Extension = new Extension(rawDummyExtension3);

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
    }
  ],
  preConversionExtensions: [
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3',
      parameters: {},
      versionId: ''
    }
  ],
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

const allProdSources = [
  {
    sourceType: 'SITEMAP',
    id: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4',
    name: 'sitemaptest',
    owner: 'prodUser@coveo.com-google',
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
        extensionId: 'ccliprodozvzoaua-vvdaravex2tqdt5npreoz2clgu',
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
                  identity: 'prodUser@coveo.com',
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
    resourceId: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4'
  }
];

const xze6hjeidrpcborfhqk4vxkgy4 = {
  sourceType: 'SITEMAP',
  id: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4',
  name: 'sitemaptest',
  owner: 'prodUser@coveo.com-google',
  sourceVisibility: 'PRIVATE',
  mappings: [
    {
      id: 'q3uv7s6lw6iqirufv4e5vhkloy',
      kind: 'COMMON',
      fieldName: 'foldingchild',
      extractionMethod: 'METADATA',
      content: '%[coveo_foldingchild]'
    },
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
  pushEnabled: false,
  onPremisesEnabled: false,
  preConversionExtensions: [],
  postConversionExtensions: [
    {
      actionOnError: 'SKIP_EXTENSION',
      condition: '',
      extensionId: 'ccliprodozvzoaua-vvdaravex2tqdt5npreoz2clgu',
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
                identity: 'prodUser@coveo.com',
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
  resourceId: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4'
};

const allProdSources2 = [
  {
    sourceType: 'SITEMAP',
    id: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4',
    name: 'sitemaptest',
    owner: 'prodUser@coveo.com-google',
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
    postConversionExtensions: [],
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
                  identity: 'prodUser@coveo.com',
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
    resourceId: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4'
  }
];

// This is a copy of a dev source without any updates expect for some keys to ignore
const xze6hjeidrpcborfhqk4vxkgy4Copy = {
  sourceType: 'SITEMAP',
  id: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4',
  name: 'sitemaptest',
  owner: 'prodUser@coveo.com-google',
  sourceVisibility: 'PRIVATE',
  mappings: [
    {
      id: 'xknmlmdlpb6e5vpukm52nzkoii',
      kind: 'COMMON',
      fieldName: 'foldingchild',
      extractionMethod: 'METADATA',
      content: '%[coveo_foldingchild]'
    },
    {
      id: 'xzhwsjxkvcksfngdospjn7keie',
      kind: 'COMMON',
      fieldName: 'printableuri',
      extractionMethod: 'METADATA',
      content: '%[printableuri]/test.html'
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
                identity: 'userDev@coveo.com',
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
  resourceId: 'ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4'
};

const allDevSources2 = [
  {
    sourceType: 'SITEMAP',
    id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
    name: 'sitemaptest',
    owner: 'userDev@coveo.com-google',
    sourceVisibility: 'PRIVATE',
    information: {
      sourceStatus: {
        type: 'DISABLED',
        allowedOperations: ['DELETE', 'REBUILD']
      },
      nextOperation: {
        operationType: 'FULL_REFRESH',
        timestamp: 1543633200000
      },
      rebuildRequired: true,
      numberOfDocuments: 0,
      documentsTotalSize: 0
    },
    pushEnabled: false,
    onPremisesEnabled: false,
    preConversionExtensions: [],
    postConversionExtensions: [],
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
                  identity: 'userDev@coveo.com',
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
  }
];

const ur4el4nwejfvpghipsvvs32m74Copy = {
  sourceType: 'SITEMAP',
  id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
  name: 'sitemaptest',
  owner: 'userDev@coveo.com-google',
  sourceVisibility: 'PRIVATE',
  mappings: [
    {
      id: 'xknmlmdlpb6e5vpukm52nzkoii',
      kind: 'COMMON',
      fieldName: 'foldingchild',
      extractionMethod: 'METADATA',
      content: '%[coveo_foldingchild]'
    },
    {
      id: 'xzhwsjxkvcksfngdospjn7keie',
      kind: 'COMMON',
      fieldName: 'printableuri',
      extractionMethod: 'METADATA',
      content: '%[printableuri]/test.html'
    }
  ],
  information: {
    sourceStatus: {
      type: 'DISABLED',
      allowedOperations: ['DELETE', 'REBUILD']
    },
    nextOperation: {
      operationType: 'FULL_REFRESH',
      timestamp: 1543633200000
    },
    rebuildRequired: true,
    numberOfDocuments: 0,
    documentsTotalSize: 0
  },
  pushEnabled: false,
  onPremisesEnabled: false,
  preConversionExtensions: [],
  postConversionExtensions: [],
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
                identity: 'userDev@coveo.com',
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
  resourceId: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74'
};

const allDevSources = [
  {
    sourceType: 'SITEMAP',
    id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
    name: 'sitemaptest',
    owner: 'userDev@coveo.com-google',
    sourceVisibility: 'PRIVATE',
    information: {
      sourceStatus: {
        type: 'DISABLED',
        allowedOperations: ['DELETE', 'REBUILD']
      },
      nextOperation: {
        operationType: 'FULL_REFRESH',
        timestamp: 1543633200000
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
                  identity: 'userDev@coveo.com',
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
    owner: 'userDev@coveo.com-google',
    sourceVisibility: 'SHARED',
    information: {
      sourceStatus: {
        type: 'DISABLED',
        allowedOperations: ['DELETE', 'REBUILD']
      },
      nextOperation: {
        operationType: 'INCREMENTAL_REFRESH',
        timestamp: 1543623960000
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
        extensionId: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
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
    ],
    resourceId: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq'
  }
];

const ur4el4nwejfvpghipsvvs32m74 = {
  sourceType: 'SITEMAP',
  id: 'cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74',
  name: 'sitemaptest',
  owner: 'userDev@coveo.com-google',
  sourceVisibility: 'PRIVATE',
  mappings: [
    {
      id: 'xknmlmdlpb6e5vpukm52nzkoii',
      kind: 'COMMON',
      fieldName: 'foldingchild',
      extractionMethod: 'METADATA',
      content: '%[coveo_foldingchild]'
    },
    {
      id: 'xzhwsjxkvcksfngdospjn7keie',
      kind: 'COMMON',
      fieldName: 'printableuri',
      extractionMethod: 'METADATA',
      content: '%[printableuri]/test.html'
    }
  ],
  information: {
    sourceStatus: {
      type: 'DISABLED',
      allowedOperations: ['DELETE', 'REBUILD']
    },
    nextOperation: {
      operationType: 'FULL_REFRESH',
      timestamp: 1543633200000
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
                identity: 'userDev@coveo.com',
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
  owner: 'userDev@coveo.com-google',
  sourceVisibility: 'SHARED',
  mappings: [
    {
      id: 'xcdsbzj2spglvzwbyeoiqecl2u',
      kind: 'COMMON',
      fieldName: 'fax',
      extractionMethod: 'METADATA',
      content: '%[fax]'
    },
    {
      id: 'xmx3f32kxl6re526vypml22ku4',
      kind: 'COMMON',
      fieldName: 'connectortype',
      extractionMethod: 'METADATA',
      content: '%[connectortype]'
    },
    {
      id: 'xobrohc7eog6oxty4hgzfskgle',
      kind: 'COMMON',
      fieldName: 'homephone',
      extractionMethod: 'METADATA',
      content: '%[homephone]'
    }
  ],
  information: {
    sourceStatus: {
      type: 'DISABLED',
      allowedOperations: ['DELETE', 'REBUILD']
    },
    nextOperation: {
      operationType: 'INCREMENTAL_REFRESH',
      timestamp: 1543623960000
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
      extensionId: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
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
  ],
  urls: ['https://www.youtube.com/dummy'],
  indexPlaylists: false,
  resourceId: 'cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq'
};

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

    describe('GetCleanVersion Method', () => {
      // TODO
    });

    describe('Extension ID and Name replacements', () => {
      it('Should replace extension ids with their according name', () => {
        const sourceController = new SourceController(org1, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(), // Make a copy of the source
          'Web Source': source2.clone() // Make a copy of the source
        });
        const extensionList = [rawExtension1, rawExtension2, rawExtension3, rawDummyExtension1, rawDummyExtension2, rawDummyExtension3];

        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        const _source1 = sourceDict.getItem('Sitemap Source');
        expect(_source1.getPostConversionExtensions()[0]['extensionId']).to.eq('URL Parsing to extract metadata');
        expect(_source1.getPostConversionExtensions()[1]['extensionId']).to.eq('Reject a document.');
        expect(_source1.getPreConversionExtensions()[0]['extensionId']).to.eq('Simply prints something');

        const _source2 = sourceDict.getItem('Web Source');
        expect(_source2.getPostConversionExtensions()[0]['extensionId']).to.eq('Simply prints something');
      });

      it('Should replace extension name with their according id', () => {
        const sourceController = new SourceController(org1, org2);
        const extensionList = [rawExtension1, rawExtension2, rawExtension3, rawDummyExtension1, rawDummyExtension2, rawDummyExtension3];
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone(),
          'Web Source': source2.clone()
        });

        sourceController.replaceExtensionIdWithName(sourceDict, extensionList);
        // Now do the revert operation
        sourceController.replaceExtensionNameWithId(sourceDict, extensionList);

        const _source1 = sourceDict.getItem('Sitemap Source');
        expect(_source1.getPostConversionExtensions()[0]['extensionId']).to.eq('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu');
        expect(_source1.getPostConversionExtensions()[1]['extensionId']).to.eq('ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44');
        expect(_source1.getPreConversionExtensions()[0]['extensionId']).to.eq('ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3');

        const _source2 = sourceDict.getItem('Web Source');
        expect(_source2.getPostConversionExtensions()[0]['extensionId']).to.eq('ccli1wq3fmkys-tdosaijdfsafds9fidsf0d9sfd3');
      });

      it('Should throw an error if the extension does not exist in the organization', () => {
        const sourceController = new SourceController(org1, org2);
        const sourceDict: Dictionary<Source> = new Dictionary({
          'Sitemap Source': source1.clone()
        });

        expect(() => sourceController.replaceExtensionIdWithName(sourceDict, [])).to.throw();
        expect(() => sourceController.replaceExtensionNameWithId(sourceDict, [])).to.throw();
      });
    });

    describe('Diff Method', () => {
      it('Should diff sources', (done: MochaDone) => {
        // TODO: This test is not usefull. this should be tested for PUT and DELETE  fraduate operations
        scope = nock(UrlService.getDefaultUrl())
          // First expected request
          .get('/rest/organizations/dev/sources')
          .reply(RequestUtils.OK, allDevSources)
          // Fecth extensions from dev
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, [rawExtension1, rawExtension2, rawExtension3])
          // Fecth extensions from Prod
          .get('/rest/organizations/prod/extensions')
          // Rename extension Ids
          .reply(RequestUtils.OK, [rawExtension4])
          // Fetching dev sources one by one
          .get('/rest/organizations/dev/sources/cclidev2l78wr0o-ur4el4nwejfvpghipsvvs32m74')
          .reply(RequestUtils.OK, ur4el4nwejfvpghipsvvs32m74)
          .get('/rest/organizations/dev/sources/cclidev2l78wr0o-uwfuop2jp2hdvo5ao7abjlsgyq')
          .reply(RequestUtils.OK, uwfuop2jp2hdvo5ao7abjlsgyq)
          // Fecthing all prod sources
          .get('/rest/organizations/prod/sources')
          .reply(RequestUtils.OK, allProdSources)
          .get('/rest/organizations/prod/sources/ccliprodozvzoaua-xze6hjeidrpcborfhqk4vxkgy4')
          .reply(RequestUtils.OK, xze6hjeidrpcborfhqk4vxkgy4);

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        controller
          .diff(diffOptions)
          .then((diff: DiffResultArray<Source>) => {
            expect(diff.TO_CREATE.length).to.eql(1);
            expect(diff.TO_UPDATE.length).to.eql(1);
            expect(diff.TO_DELETE.length).to.eql(0);
            done();
          })
          .catch((err: IGenericError) => {
            done(err);
          });
      });

      it('Should not have updated source in the diff', (done: MochaDone) => {
        // TODO: This test is not usefull. this should be tested for PUT and DELETE  fraduate operations
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

      it('Should return the clean diff version', () => {
        const diffResultArray: DiffResultArray<Source> = new DiffResultArray();
        diffResultArray.TO_CREATE.push(new Source(uwfuop2jp2hdvo5ao7abjlsgyq));
        diffResultArray.TO_UPDATE.push(new Source(ur4el4nwejfvpghipsvvs32m74));
        diffResultArray.TO_UPDATE_OLD.push(new Source(xze6hjeidrpcborfhqk4vxkgy4));

        const diffOptions = { keysToIgnore: ['information', 'resourceId', 'id', 'owner'] };
        const cleanVersion = controller.getCleanVersion(diffResultArray, diffOptions);

        const updatedSource = cleanVersion.TO_UPDATE[0];
        expect(updatedSource.id, 'Should not include the source id in the diff').to.not.have.keys('newValue', 'oldValue');
        expect(updatedSource.owner, 'Should not include the `owner` property in the diff').to.not.have.keys('newValue', 'oldValue');
        expect(updatedSource.resourceId, 'Should not include the `resourceId` property in the diff').to.not.have.keys(
          'newValue',
          'oldValue'
        );
        expect(updatedSource.information, 'Should not include the `information` property in the diff').to.not.have.keys(
          'newValue',
          'oldValue'
        );
      });
    });

    // describe('Graduate Method', () => {
    //   // TODO
    // });
  });
};
