import * as _ from 'underscore';
import * as nock from 'nock';
import { expect, assert } from 'chai';
import { ExtensionController } from './../../src/controllers/ExtensionController';
import { Organization } from '../../src/coveoObjects/Organization';
import { Utils } from '../../src/commons/utils/Utils';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { Extension } from '../../src/coveoObjects/Extension';

export const ExtensionControllerTest = () => {
  describe('Field Controller', () => {
    // Organizations
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    // Controller
    const controller = new ExtensionController(org1, org2);

    // let scope: nock.Scope;

    const extension1 = new Extension({
      content: 'import urlparse\n\nprint "Hello Word"',
      description: 'This is an extension that prints an "Hello Word"',
      name: 'Hello Word',
      id: 'yifpsa8fgudsihmfshjd',
      requiredDataStreams: []
    });

    const extension2 = new Extension({
      id: 'yidmuo9dsuop8fuihmfdjshjd',
      content:
        'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    });

    const extension3 = new Extension({
      id: 'sa2fjv3lwf67va2pbiztb22fsu',
      content:
        'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    });

    afterEach(() => {
      // if (Utils.exists(scope)) {
      //   expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
      // }

      // Reset Orgs
      org1.clearExtensions();
      org2.clearExtensions();
    });

    describe('GetCleanVersion Method', () => {
      it('Should return the clean diff version - empty', () => {
        const diffResultArray: DiffResultArray<Extension> = new DiffResultArray();
        const cleanVersion = controller.getCleanVersion(diffResultArray, (extensions: Extension[]) =>
          _.map(extensions, (e: Extension) => e.getExtensionModel())
        );
        expect(cleanVersion).to.eql({
          summary: { TO_CREATE: 0, TO_UPDATE: 0, TO_DELETE: 0 },
          TO_CREATE: [],
          TO_UPDATE: [],
          TO_DELETE: []
        });
      });
    });

    it('Should return the clean diff version', () => {
      const diffResultArray: DiffResultArray<Extension> = new DiffResultArray();
      diffResultArray.TO_CREATE.push(extension1);
      diffResultArray.TO_UPDATE.push(extension2);
      diffResultArray.TO_UPDATE.push(extension3);

      const cleanVersion = controller.getCleanVersion(diffResultArray, (fields: Extension[]) =>
        _.map(fields, (f: Extension) => f.getExtensionModel())
      );
      expect(cleanVersion).to.eql({
        summary: { TO_CREATE: 1, TO_UPDATE: 2, TO_DELETE: 0 },
        TO_CREATE: [
          {
            content: 'import urlparse\n\nprint "Hello Word"',
            description: 'This is an extension that prints an "Hello Word"',
            name: 'Hello Word',
            requiredDataStreams: []
          }
        ],
        TO_UPDATE: [
          {
            content:
              'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          },
          {
            content:
              'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          }
        ],
        TO_DELETE: []
      });
    });
  });
};
