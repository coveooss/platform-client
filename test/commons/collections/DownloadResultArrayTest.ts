// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { DownloadResultArray } from '../../../src/commons/collections/DownloadResultArray';

export const DownloadResultArrayTest = () => {
  describe('DownloadResultArray', () => {
    it('Should init a DownloadResult Object without items', () => {
      const DownloadResult: DownloadResultArray<string> = new DownloadResultArray();
      expect(DownloadResult.containsItems()).to.be.false;
      expect(DownloadResult.getCount()).to.equal(0);
    });

    it('Should add items to the DownloadResult Object', () => {
      const DownloadResult: DownloadResultArray<string> = new DownloadResultArray();
      DownloadResult.ITEMS.push('deleted value');
      DownloadResult.ITEMS.push('updated value');
      expect(DownloadResult.containsItems()).to.be.true;
      expect(DownloadResult.getCount()).to.equal(2);
    });

    it('Should add and remove items to the DownloadResult Object', () => {
      const DownloadResult: DownloadResultArray<string> = new DownloadResultArray();
      DownloadResult.ITEMS.push('updated value');
      expect(DownloadResult.containsItems()).to.be.true;
      expect(DownloadResult.getCount()).to.equal(1);
      DownloadResult.ITEMS.pop();
      expect(DownloadResult.containsItems()).to.be.false;
      expect(DownloadResult.getCount()).to.equal(0);
    });
  });
};
