import { expect, should, assert } from 'chai';
import { ArrayUtils } from '../../src/commons/utils/ArrayUtils';

export const ArrayUtilTest = () => {
  describe('chunkArray', () => {

    it('Should create chunks of array (even)', () => {
      let array: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(ArrayUtils.chunkArray(array, 4)).to.eql([[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    it('Should create chunks of array (odd)', () => {
      let array: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(ArrayUtils.chunkArray(array, 5)).to.eql([[1, 2, 3, 4, 5], [6, 7, 8]]);
    });

    it('Should create chunks one array', () => {
      let array: number[] = [1, 2, 3];
      expect(ArrayUtils.chunkArray(array, 3)).to.eql([[1, 2, 3]]);
    });

    it('Should create chunks one array even if the chucksize is bigger than the array length', () => {
      let array: number[] = [1, 2, 3];
      expect(ArrayUtils.chunkArray(array, 4)).to.eql([[1, 2, 3]]);
    });

    it('Should create chunks one array even if the chucksize is bigger than the array length', () => {
      let array: number[] = [1, 2, 3];
      expect(() => ArrayUtils.chunkArray(array, 0)).to.throw();
    });

  });
};
