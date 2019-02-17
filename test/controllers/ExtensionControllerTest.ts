// tslint:disable:no-magic-numbers
import { assert, expect } from 'chai';
import * as nock from 'nock';
import { IGraduateOptions } from '../../src/commands/GraduateCommand';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { IGenericError } from '../../src/commons/errors';
import { UrlService } from '../../src/commons/rest/UrlService';
import { RequestUtils } from '../../src/commons/utils/RequestUtils';
import { Utils } from '../../src/commons/utils/Utils';
import { Extension } from '../../src/coveoObjects/Extension';
import { Organization } from '../../src/coveoObjects/Organization';
import { ExtensionController } from './../../src/controllers/ExtensionController';

export const ExtensionControllerTest = () => {
  describe('Extension Controller', () => {
    // Organizations
    const org1: Organization = new Organization('dev', 'xxx');
    const org2: Organization = new Organization('prod', 'yyy');

    // Controller
    const controller = new ExtensionController(org1, org2);

    let scope: nock.Scope;

    const yidmuo9dsuop8fuihmfdjshjd = {
      id: 'yidmuo9dsuop8fuihmfdjshjd',
      content: 'A new extension',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'All metadata value',
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

    const prodmuo9dsuop8fuihmfdjshjd = {
      id: 'prodmuo9dsuop8fuihmfdjshjd',
      content: 'print "new content"',
      description: 'This extension is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    };

    const prodOrganizationExtension = [
      {
        createdDate: 1511812769000,
        description: '',
        enabled: true,
        id: 'prodmuo9dsuop8fuihmfdjshjd',
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
      }
    ];

    const devOrganizationExtension = [
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

    const extension2Old = new Extension({
      id: 'yidmuo9dsuop8fuihmfdjshjd',
      content:
        'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
      description: 'This extension is the older version, it is used to parse urls to extract metadata like categories.',
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: []
    });

    afterEach(() => {
      if (Utils.exists(scope)) {
        expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
      }

      // Reset Orgs
      org1.clearExtensions();
      org2.clearExtensions();
    });

    after(() => {
      nock.cleanAll();
    });

    describe('GetCleanVersion Method', () => {
      it('Should return the clean diff version - empty', () => {
        const diffResultArray: DiffResultArray<Extension> = new DiffResultArray();
        const cleanVersion = controller.getCleanVersion(diffResultArray);
        expect(cleanVersion).to.eql({
          summary: { TO_CREATE: 0, TO_UPDATE: 0, TO_DELETE: 0 },
          TO_CREATE: [],
          TO_UPDATE: [],
          TO_DELETE: []
        });
      });

      it('Should return the clean diff version', () => {
        const diffResultArray: DiffResultArray<Extension> = new DiffResultArray();
        diffResultArray.TO_CREATE.push(extension1);
        diffResultArray.TO_UPDATE.push(extension2);
        diffResultArray.TO_UPDATE_OLD.push(extension2Old);

        const cleanVersion = controller.getCleanVersion(diffResultArray);
        expect(cleanVersion).to.eql({
          summary: { TO_CREATE: 1, TO_UPDATE: 1, TO_DELETE: 0 },
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
              description: {
                newValue: 'This extension is used to parse urls to extract metadata like categories.',
                oldValue: 'This extension is the older version, it is used to parse urls to extract metadata like categories.'
              },
              name: 'URL Parsing to extract metadata',
              requiredDataStreams: []
            }
          ],
          TO_DELETE: []
        });
      });
    });

    describe('Diff Method', () => {
      it('Should not diff: ACCESS_DENIED', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev extensions (will return an error)
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.ACCESS_DENIED, 'some message')
          // Fecthing all prod extensions
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          // Fetching prod extensions one by one
          .get('/rest/organizations/prod/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd);

        controller
          .diff()
          .then((diffResultArray: DiffResultArray<Extension>) => {
            done('This function should not resolve');
          })
          .catch((err: IGenericError) => {
            expect(err.orgId).to.equal('dev');
            assert.throws(() => {
              throw Error(err.message);
            }, 'some message');
            // removing pending mocks since since
            nock.cleanAll();
            done();
          });
      });

      it('Should not return an empty diff result', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev extensions
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, devOrganizationExtension)
          // Fetching dev extensions one by one
          .get('/rest/organizations/dev/extensions/yidmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, yidmuo9dsuop8fuihmfdjshjd)
          .get('/rest/organizations/dev/extensions/sa2fjv3lwf67va2pbiztb22fsu')
          .reply(RequestUtils.OK, sa2fjv3lwf67va2pbiztb22fsu)
          .get('/rest/organizations/dev/extensions/tknepx33tdhmqibch2uzxhcc44')
          .reply(RequestUtils.OK, tknepx33tdhmqibch2uzxhcc44)
          // Fecthing all prod extensions
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          // Fetching prod extensions one by one
          .get('/rest/organizations/prod/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd);

        controller
          .diff()
          .then((diff: DiffResultArray<Extension>) => {
            expect(diff.containsItems()).to.be.true;
            expect(diff.TO_CREATE.length).to.equal(2, 'Should have 2 new extensions');
            expect(diff.TO_UPDATE.length).to.equal(1, 'Should have 1 updated extension');
            expect(diff.TO_DELETE.length).to.equal(0, 'Should have no deleted extension');
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should diff', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev extensions
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, devOrganizationExtension)
          // Fetching dev extensions one by one
          .get('/rest/organizations/dev/extensions/yidmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, yidmuo9dsuop8fuihmfdjshjd)
          .get('/rest/organizations/dev/extensions/sa2fjv3lwf67va2pbiztb22fsu')
          .reply(RequestUtils.OK, sa2fjv3lwf67va2pbiztb22fsu)
          .get('/rest/organizations/dev/extensions/tknepx33tdhmqibch2uzxhcc44')
          .reply(RequestUtils.OK, tknepx33tdhmqibch2uzxhcc44)
          // Fecthing all prod extensions
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          // Fetching prod extensions one by one
          .get('/rest/organizations/prod/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd);

        controller
          .diff()
          .then((diffResultArray: DiffResultArray<Extension>) => {
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });

      it('Should not retrieve blacklisted extensions during the diff', (done: MochaDone) => {
        const orgx: Organization = new Organization('dev', 'xxx', { extensions: ['All metadata value', 'reject a Document.'] });
        const orgy: Organization = new Organization('prod', 'yyy');
        const controllerxy = new ExtensionController(orgx, orgy);

        scope = nock(UrlService.getDefaultUrl())
          // Fecthing all dev extensions
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, devOrganizationExtension)
          // Fetching dev extensions one by one
          // .get('/rest/organizations/dev/extensions/yidmuo9dsuop8fuihmfdjshjd')
          // .reply(RequestUtils.OK, yidmuo9dsuop8fuihmfdjshjd)
          .get('/rest/organizations/dev/extensions/sa2fjv3lwf67va2pbiztb22fsu')
          .reply(RequestUtils.OK, sa2fjv3lwf67va2pbiztb22fsu)
          // .get('/rest/organizations/dev/extensions/tknepx33tdhmqibch2uzxhcc44')
          // .reply(RequestUtils.OK, tknepx33tdhmqibch2uzxhcc44)
          // Fecthing all prod extensions
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          // Fetching prod extensions one by one
          .get('/rest/organizations/prod/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd);

        controllerxy
          .diff()
          .then((diffResultArray: DiffResultArray<Extension>) => {
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });
    });

    describe('Graduate Method', () => {
      it('Should have nothing to graduate: Similar orgs', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .get('/rest/organizations/dev/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          .get('/rest/organizations/dev/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd)
          .get('/rest/organizations/prod/extensions')
          .reply(RequestUtils.OK, prodOrganizationExtension)
          .get('/rest/organizations/prod/extensions/prodmuo9dsuop8fuihmfdjshjd')
          .reply(RequestUtils.OK, prodmuo9dsuop8fuihmfdjshjd);

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {}
        };

        controller.diff().then((diffResultArray: DiffResultArray<Extension>) => {
          controller
            .graduate(diffResultArray, graduateOptions)
            .then((resolved: any[]) => {
              expect(resolved).to.be.empty;
              done();
            })
            .catch((err: any) => {
              done(err);
            });
        });
      });

      it('Should graduate', (done: MochaDone) => {
        scope = nock(UrlService.getDefaultUrl())
          .post('/rest/organizations/prod/extensions', {
            content: 'print "all metadata"',
            description: 'This extension is showing all available metadata',
            name: 'All metadata value',
            requiredDataStreams: []
          })
          .reply(RequestUtils.OK)
          // Creating secon extention in prod
          .post('/rest/organizations/prod/extensions', {
            content:
              'import subprocess\nimport shutil\nimport uuid\nimport os\nimport base64\nfrom io import BytesIO\n\n\n# Title: Resize images to a smaller size\n# Description: This extension demonstrate how you can call the GraphicsMagick library from the command\n# Description: line in an extension. You could use that on the document body, a thumbnail or a field containing binary \n# Description: data in base64 format (like an avatar, when indexing users)\n# Required data: \n\n# Command line command and arguments\nCOMPRESS_CMDLINE = \'gm convert {} -resample 150 -compress JPEG -quality 50 {}\'\n\n# decode to bytes\nbyte_data = BytesIO(base64.b64decode(document.get_meta_data_value("base64data")[0]))\n\ndocument_api.v1.log("Original size: " + str(len(document.get_meta_data_value("base64data")[0])), severity="normal")\n\n# Define original and compressed filenames\n# original_file = os.path.join(document_api.working_path, str(uuid.uuid4()))\noriginal_file = os.path.join(os.getcwd(), str(uuid.uuid4()))\ncompressed_file = original_file + ".jpg"\n\ndocument_api.v1.log("Paths:" + original_file + "::" + compressed_file, severity="normal")\n\n# Write the image to disk\nwith open(original_file, \'wb\') as f:\n    shutil.copyfileobj(byte_data, f)\n\ndocument_api.v1.log("Image written to disk", severity="normal")\n\nconvert = subprocess.Popen(COMPRESS_CMDLINE.format(original_file, compressed_file), shell=True, stdout=subprocess.PIPE,\n                           stderr=subprocess.PIPE)\nout, err = convert.communicate()\n\ndocument_api.v1.log("Errors (if any): " + out + "::" + err, severity="normal")\n\ndocument_api.v1.log("Image compressed", severity="normal")\n\nwith open(compressed_file, \'rb\') as f:\n    base64data = base64.b64encode(f.read())\n    document_api.v1.log("New size: " + str(len(base64data)), severity="normal")\n    \ndocument_api.v1.add_meta_data({"base64data": base64data})\n',
            description:
              'This extension demonstrate how you can call the GraphicsMagick library from the command line in an extension. You could use that on the document body, a thumbnail or a field containing binary  data in base64 format (like an avatar, when indexing users)',
            name: 'Resize images to a smaller size',
            requiredDataStreams: []
          })
          .reply(RequestUtils.OK)
          // Updating one extension in prod
          .put('/rest/organizations/prod/extensions/extension-to-update-destination-org', {
            content:
              'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          })
          .reply(RequestUtils.NO_CONTENT)
          // Deleting one extension in prod
          .delete('/rest/organizations/prod/extensions/extension-to-delete')
          .reply(RequestUtils.NO_CONTENT);

        const extensionDiff: DiffResultArray<Extension> = new DiffResultArray();

        extensionDiff.TO_CREATE = [
          new Extension({
            id: 'random-id',
            content: 'print "all metadata"',
            description: 'This extension is showing all available metadata',
            name: 'All metadata value',
            requiredDataStreams: []
          }),
          new Extension({
            id: 'random-id-2',
            content:
              'import subprocess\nimport shutil\nimport uuid\nimport os\nimport base64\nfrom io import BytesIO\n\n\n# Title: Resize images to a smaller size\n# Description: This extension demonstrate how you can call the GraphicsMagick library from the command\n# Description: line in an extension. You could use that on the document body, a thumbnail or a field containing binary \n# Description: data in base64 format (like an avatar, when indexing users)\n# Required data: \n\n# Command line command and arguments\nCOMPRESS_CMDLINE = \'gm convert {} -resample 150 -compress JPEG -quality 50 {}\'\n\n# decode to bytes\nbyte_data = BytesIO(base64.b64decode(document.get_meta_data_value("base64data")[0]))\n\ndocument_api.v1.log("Original size: " + str(len(document.get_meta_data_value("base64data")[0])), severity="normal")\n\n# Define original and compressed filenames\n# original_file = os.path.join(document_api.working_path, str(uuid.uuid4()))\noriginal_file = os.path.join(os.getcwd(), str(uuid.uuid4()))\ncompressed_file = original_file + ".jpg"\n\ndocument_api.v1.log("Paths:" + original_file + "::" + compressed_file, severity="normal")\n\n# Write the image to disk\nwith open(original_file, \'wb\') as f:\n    shutil.copyfileobj(byte_data, f)\n\ndocument_api.v1.log("Image written to disk", severity="normal")\n\nconvert = subprocess.Popen(COMPRESS_CMDLINE.format(original_file, compressed_file), shell=True, stdout=subprocess.PIPE,\n                           stderr=subprocess.PIPE)\nout, err = convert.communicate()\n\ndocument_api.v1.log("Errors (if any): " + out + "::" + err, severity="normal")\n\ndocument_api.v1.log("Image compressed", severity="normal")\n\nwith open(compressed_file, \'rb\') as f:\n    base64data = base64.b64encode(f.read())\n    document_api.v1.log("New size: " + str(len(base64data)), severity="normal")\n    \ndocument_api.v1.add_meta_data({"base64data": base64data})\n',
            description:
              'This extension demonstrate how you can call the GraphicsMagick library from the command line in an extension. You could use that on the document body, a thumbnail or a field containing binary  data in base64 format (like an avatar, when indexing users)',
            name: 'Resize images to a smaller size',
            requiredDataStreams: []
          })
        ];

        extensionDiff.TO_UPDATE = [
          new Extension({
            id: 'extension-to-update',
            content:
              'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          })
        ];

        extensionDiff.TO_UPDATE_OLD = [
          new Extension({
            id: 'extension-to-update-destination-org',
            content: '#TODO.....',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          })
        ];

        extensionDiff.TO_DELETE = [
          new Extension({
            id: 'extension-to-delete',
            content:
              'import urlparse\n\n# Title: URL Parsing to extract metadata\n# Description: This extension is used to parse urls to extract metadata like categories.\n# Required data:\n\n# captures the Web Path\npath = urlparse.urlparse(document.uri).path\n\ncategories = {}\n\nfor i, p in enumerate(path.split("/")):\n    # path will start with /, so the first p (i=0) is usually empty\n    if p:\n        # Add categories as meta1, meta2, meta3.\n        # You can use an array if you want specific names for the categories.\n        categories[\'meta\'+str(i)] = p\n\nif len(categories):\n    # Set the categories\n    document.add_meta_data(categories)\n',
            description: 'This extension is used to parse urls to extract metadata like categories.',
            name: 'URL Parsing to extract metadata',
            requiredDataStreams: []
          })
        ];

        const graduateOptions: IGraduateOptions = {
          POST: true,
          PUT: true,
          DELETE: true,
          diffOptions: {}
        };

        controller
          .graduate(extensionDiff, graduateOptions)
          .then((resolved: any[]) => {
            // expect(resolved).to.be.empty;
            done();
          })
          .catch((err: any) => {
            done(err);
          });
      });
    });
  });
};
