// tslint:disable:no-magic-numbers
import { expect } from 'chai';
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
      diffResult.TO_CREATE.push('deleted value');
      diffResult.TO_UPDATE.push('updated value');
      expect(diffResult.containsItems()).to.be.true;
      expect(diffResult.getCount()).to.equal(2);
    });

    it('Should add and remove items to the DiffResult Object', () => {
      const diffResult: DiffResultArray<string> = new DiffResultArray();
      diffResult.TO_UPDATE.push('updated value');
      diffResult.TO_UPDATE_OLD.push('old value'); // this should not affect the count
      expect(diffResult.containsItems()).to.be.true;
      expect(diffResult.getCount()).to.equal(1);
      diffResult.TO_UPDATE.pop();
      expect(diffResult.containsItems()).to.be.false;
      expect(diffResult.getCount()).to.equal(0);
    });
  });
};
