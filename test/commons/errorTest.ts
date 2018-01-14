import { expect } from 'chai';
import { StaticErrorMessage } from '../../src/commons/errors';

export const ErrorTest = () => {
  describe('Error', () => {
    it('Should not be an empty string', () => {
      expect(StaticErrorMessage.UNABLE_TO_DIFF).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_GRADUATE).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_API_REQUEST).to.not.be.empty.string;
      expect(StaticErrorMessage.MISSING_FIELD_NAME).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_LOAD_FIELDS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_LOAD_OTHER_FIELDS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_CREATE_FIELDS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_UPDATE_FIELDS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_DELETE_FIELDS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_LOAD_EXTENTIONS).to.not.be.empty.string;
      expect(StaticErrorMessage.UNABLE_TO_LOAD_SINGLE_EXTENTION).to.not.be.empty.string;
    });
  });
};
