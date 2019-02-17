// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { DownloadResultArray } from '../../../src/commons/collections/DownloadResultArray';
import { Field } from '../../../src/coveoObjects/Field';

export const DownloadResultArrayTest = () => {
  describe('DownloadResultArray', () => {
    it('Should init a DownloadResult Object without items', () => {
      const DownloadResult: DownloadResultArray = new DownloadResultArray();
      expect(DownloadResult.containsItems()).to.be.false;
      expect(DownloadResult.getCount()).to.equal(0);
    });

    it('Should add items to the DownloadResult Object', () => {
      const DownloadResult: DownloadResultArray = new DownloadResultArray();
      DownloadResult.add(
        new Field({
          name: 'field1'
        })
      );
      DownloadResult.add(
        new Field({
          name: 'field2'
        })
      );
      expect(DownloadResult.containsItems()).to.be.true;
      expect(DownloadResult.getCount()).to.equal(2);
    });
  });
};
