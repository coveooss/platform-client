import { expect, should } from 'chai';
import { Extension } from '../../src/coveoObjects/Extension';

export const ExtensionTest = () => {
  describe('Extension Model', () => {
    const extensionConfig = {
      // tslint:disable-next-line:max-line-length
      content: 'import urlparse\n\n# Title: NEW TITLE\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      createdDate: 1511812769000,
      description: 'This extension is used to parse urls to extract metadata like categories.',
      enabled: true,
      id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
      lastModified: 1511812770000,
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: [
        'DOCUMENT_DATA'
      ],
      versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX',
      usedBy: [],
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
    };

    it('Should define the extension Id', () => {
      let extension: Extension = new Extension('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', extensionConfig);
      expect(extension.getId()).to.equal('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', 'Invalid extension Id');
    });

    it('Should return the extension content', () => {
      let extension: Extension = new Extension('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', extensionConfig);
      // tslint:disable-next-line:max-line-length
      expect(extension.getContent()).to.equal('import urlparse\n\n# Title: NEW TITLE\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n', 'Invalid configuration');
    });

    it('Should return the extension description', () => {
      let extension: Extension = new Extension('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', extensionConfig);
      expect(extension.getDescription()).to.equal('This extension is used to parse urls to extract metadata like categories.', 'Invalid description');
    });

    it('Should return the extension name', () => {
      let extension: Extension = new Extension('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', extensionConfig);
      expect(extension.getName()).to.equal('URL Parsing to extract metadata', 'Invalid name');
    });

    it('Should return the extension required Data Streams', () => {
      let extension: Extension = new Extension('ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu', extensionConfig);
      expect(extension.getRequiredDataStreams()).to.be.eql(['DOCUMENT_DATA'], 'Invalid data streams');
    });

    it('Should not allow the creation of an extension instance without a valid configuration', () => {
      expect(() => new Extension('extension-random-id', {
        description: 'This extension is used to parse urls to extract metadata like categories.',
        id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
        name: 'URL Parsing to extract metadata',
        requiredDataStreams: [
          'DOCUMENT_DATA'
        ],
      })).to.throw();
      expect(() => new Extension('extension-random-id', {
        // tslint:disable-next-line:max-line-length
        content: 'import urlparse\n\n# Title: NEW TITLE\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
        id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
        name: 'URL Parsing to extract metadata',
        requiredDataStreams: [
          'DOCUMENT_DATA'
        ],
      })).to.throw();
      expect(() => new Extension('extension-random-id', {
        // tslint:disable-next-line:max-line-length
        content: 'import urlparse\n\n# Title: NEW TITLE\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
        description: 'This extension is used to parse urls to extract metadata like categories.',
        id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
        requiredDataStreams: [
          'DOCUMENT_DATA'
        ],
      })).to.throw();
      expect(() => new Extension('extension-random-id', {
        // tslint:disable-next-line:max-line-length
        content: 'import urlparse\n\n# Title: NEW TITLE\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
        description: 'This extension is used to parse urls to extract metadata like categories.',
        id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
        name: 'URL Parsing to extract metadata'
      })).to.throw();
    });

  });
};
