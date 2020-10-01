import { expect } from 'chai';
import { EnvironmentUtils } from '../../../src/commons/utils/EnvironmentUtils';

export const EnvironmentUtilsTest = () => {
  describe('Config', () => {
    it('Should return default environment', () => {
      const env = EnvironmentUtils.getDefaultEnvironment();
      expect(env).to.eql('https://platform.cloud.coveo.com');
    });
  });
};
