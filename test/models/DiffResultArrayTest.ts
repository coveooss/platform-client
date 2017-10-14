import { expect, should } from 'chai';
import { DiffUtils } from '../../src/commons/utils/DiffUtils';
import { DiffResultArray } from '../../src/models/DiffResultArray';

export const DiffResultArrayTest = () => {
  describe('DiffResultArray', () => {

    it('Should init a DiffResult Object without items', () => {
      let diffResult: DiffResultArray<string> = new DiffResultArray();
      expect(diffResult.ContainsItems()).to.be.false;
      expect(diffResult.Count()).to.equal(0);
    });

    it('Should add items to the DiffResult Object', () => {
      let diffResult: DiffResultArray<string> = new DiffResultArray();
      diffResult.NEW.push('deleted value')
      diffResult.UPDATED.push('updated value')
      expect(diffResult.ContainsItems()).to.be.true;
      expect(diffResult.Count()).to.equal(2);
    });

    it('Should add and remove items to the DiffResult Object', () => {
      let diffResult: DiffResultArray<string> = new DiffResultArray();
      diffResult.UPDATED.push('updated value')
      expect(diffResult.ContainsItems()).to.be.true;
      expect(diffResult.Count()).to.equal(1);
      diffResult.UPDATED.pop()
      expect(diffResult.ContainsItems()).to.be.false;
      expect(diffResult.Count()).to.equal(0);
    });
  });
}
