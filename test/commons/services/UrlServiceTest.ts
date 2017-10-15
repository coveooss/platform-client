import { expect, should } from 'chai';
import { UrlService } from '../../../src/commons/services/UrlService';

export const UrlServiceTest = () => {
  describe('UrlServices', () => {

    it('Should add an item to the dictionnary', () => {
      let a = UrlService.getFieldsPageUrl('myOrgId', 0);
      // console.log('*********************');
      // console.log(a);
      // console.log('*********************');

      // UrlService.updateFields('myOrgId')
      // UrlService.createFields('myOrgId')
      // UrlService.deleteFields('myOrgId')
    });

  });
}
