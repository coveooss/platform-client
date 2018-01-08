// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { ArrayUtils } from '../../../src/commons/utils/ArrayUtils';
import { Logger } from '../../../src/commons/logger';

export const ArrayUtilTest = () => {
  describe('chunkArray', () => {
    it('Should create chunks of array (even)', () => {
      const array: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(ArrayUtils.chunkArray(array, 4)).to.eql([[1, 2, 3, 4], [5, 6, 7, 8]]);
    });

    it('Should create chunks of array (odd)', () => {
      const array: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
      expect(ArrayUtils.chunkArray(array, 5)).to.eql([[1, 2, 3, 4, 5], [6, 7, 8]]);
    });

    it('Should create chunks one array', () => {
      const array: number[] = [1, 2, 3];
      expect(ArrayUtils.chunkArray(array, 3)).to.eql([[1, 2, 3]]);
    });

    it('Should create chunks one array even if the chucksize is bigger than the array length', () => {
      const array: number[] = [1, 2, 3];
      expect(ArrayUtils.chunkArray(array, 4)).to.eql([[1, 2, 3]]);
    });

    it('Should create chunks one array even if the chucksize is bigger than the array length', () => {
      const array: number[] = [1, 2, 3];
      expect(() => ArrayUtils.chunkArray(array, 0)).to.throw();
    });
  });
};
