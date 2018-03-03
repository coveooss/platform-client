import { expect } from 'chai';
import * as fs from 'fs-extra';
import { FileUtils } from './../../../src/commons/utils/FileUtils';

export const FileUtilsTest = () => {
  describe('File Utils', () => {
    const TEST_FILE = 'testfile.log';

    beforeEach(() => {
      fs.removeSync(TEST_FILE);
    });

    afterEach(() => {
      fs.removeSync(TEST_FILE);
    });

    it('Should append content to file', (done: MochaDone) => {
      FileUtils.appendToFile(TEST_FILE, 'Ut eiusmod fugiat ea cillum tempor sunt esse.')
        .then(() => {
          const content = fs.readFileSync(TEST_FILE);
          expect(`${content}`).to.equal('Ut eiusmod fugiat ea cillum tempor sunt esse.');
          done();
        })
        .catch((err: any) => done(err));
    });

    it('Should write JSON to file', (done: MochaDone) => {
      const obj = {
        a: 1,
        b: { c: 2, d: 3 }
      };
      FileUtils.writeJson(TEST_FILE, obj)
        .then(() => {
          const content = fs.readFileSync(TEST_FILE);
          expect(`${content}`).to.equal('{\n  "a": 1,\n  "b": {\n    "c": 2,\n    "d": 3\n  }\n}\n');
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });
  });
};
