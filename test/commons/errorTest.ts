import { expect } from 'chai';
import { each } from 'underscore';
import { StaticErrorMessage } from '../../src/commons/errors';

export const ErrorTest = () => {
  describe('Error Messages', () => {
    it('Should not be an empty string', () => {
      const keys: string[] = Object.keys(StaticErrorMessage);

      each(keys, (key: string) => {
        expect((StaticErrorMessage as any)[key]).to.not.be.empty.string;
      });
    });
  });
};
