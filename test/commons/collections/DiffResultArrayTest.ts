// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { DiffUtils } from '../../../src/commons/utils/DiffUtils';
import { DiffResultArray } from '../../../src/commons/collections/DiffResultArray';

export const DiffResultArrayTest = () => {
  describe('DiffResultArray', () => {
    it('Should init a DiffResult Object without items', () => {
      const diffResult: DiffResultArray<string> = new DiffResultArray();
      expect(diffResult.containsItems()).to.be.false;
      expect(diffResult.getCount()).to.equal(0);
    });

    it('Should add items to the DiffResult Object', () => {
      const diffResult: DiffResultArray<string> = new DiffResultArray();
      diffResult.NEW.push('deleted value');
      diffResult.UPDATED.push('updated value');
      expect(diffResult.containsItems()).to.be.true;
      expect(diffResult.getCount()).to.equal(2);
    });

    it('Should add and remove items to the DiffResult Object', () => {
      const diffResult: DiffResultArray<string> = new DiffResultArray();
      diffResult.UPDATED.push('updated value');
      expect(diffResult.containsItems()).to.be.true;
      expect(diffResult.getCount()).to.equal(1);
      diffResult.UPDATED.pop();
      expect(diffResult.containsItems()).to.be.false;
      expect(diffResult.getCount()).to.equal(0);
    });
  });
};
