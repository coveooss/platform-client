import { expect, should } from 'chai';
import { DiffUtils } from '../../src/commons/utils/DiffUtils';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { DiffResultArray } from '../../src/models/DiffResultArray';

export const DiffUtilsTest = () => {
  describe('Get Diff Result', () => {

    let dict1: Dictionary<Array<any>> = new Dictionary();
    dict1.Add('key1', [1, 'a']);
    dict1.Add('key2', [2, 'b']);
    dict1.Add('key3', [3, 'c']);
    dict1.Add('key4', [4, 'd']);

    let dict2: Dictionary<Array<any>> = new Dictionary({
      key3: [3, 'c'],
      key2: [2, 'b'],
      key1: [1, 'a'],
      key4: [4, 'd']
    });

    let dictDeleted: Dictionary<Array<any>> = new Dictionary({
      key2: [2, 'b'],
      key4: [4, 'd']
    });

    let dictUpdated: Dictionary<Array<any>> = new Dictionary({
      key3: [3, 'c'],
      key1: [1, 'aaa'],
      key2: [2, 'bb'],
      key4: [22, 'd']
    });

    let dictCreated: Dictionary<Array<any>> = new Dictionary({
      key4: [4, 'd'],
      key1: [1, 'a'],
      key5: [5, 'e'],
      key2: [2, 'b'],
      key3: [3, 'c'],
      key6: [6, 'f']
    });

    let dictAll: Dictionary<Array<any>> = new Dictionary({
      key1: [11, 'a'],
      Charizard: [6, 'fire'],
      key4: [4, 'd'],
      key2: [2, 'b'],
      Sandshrew: [27, 'ground']
    });

    it('Should not return any differences', () => {
      let diff: DiffResultArray<Array<any>> = DiffUtils.getDiffResult(dict1.Clone(), dict2.Clone());
      expect(diff.ContainsItems()).to.be.false;
    });

    it('Should return the new items', () => {
      let diff: DiffResultArray<Array<any>> = DiffUtils.getDiffResult(dict1.Clone(), dictDeleted.Clone());
      expect(diff.ContainsItems()).to.be.true;
      expect(diff.NEW).to.eql([[1, 'a'], [3, 'c']]);
    });

    it('Should return the updated items', () => {
      let diff: DiffResultArray<Array<any>> = DiffUtils.getDiffResult(dict1.Clone(), dictUpdated.Clone());
      expect(diff.ContainsItems()).to.be.true;
      expect(diff.UPDATED).to.eql([[1, 'a'], [2, 'b'], [4, 'd']]);
    });

    it('Should return the deleted items', () => {
      let diff: DiffResultArray<Array<any>> = DiffUtils.getDiffResult(dict1.Clone(), dictCreated.Clone());
      expect(diff.ContainsItems()).to.be.true;
      expect(diff.DELETED).to.eql([[5, 'e'], [6, 'f']]);
    });

    it('Should return all modifications', () => {
      let diff: DiffResultArray<Array<any>> = DiffUtils.getDiffResult(dict1.Clone(), dictAll.Clone());
      expect(diff.ContainsItems()).to.be.true;

      expect(diff.NEW).to.eql([[3, 'c']]);
      expect(diff.UPDATED).to.eql([[1, 'a']]);
      expect(diff.DELETED).to.eql([[6, 'fire'], [27, 'ground']]);
    });

  });
}
