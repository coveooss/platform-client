import { expect } from 'chai';
import { EnvironmentUtils } from '../../../src/commons/utils/EnvironmentUtils';

export const EnvironmentUtilsTest = () => {
  describe('Config', () => {
    it('Should set the current environment', () => {
      // Get current environment
      const env = EnvironmentUtils.getNodeEnvironment();

      EnvironmentUtils.setNodeEnvironment('superTest');
      expect(process.env.NODE_ENV).to.eql('superTest');

      // Restore previous environment
      EnvironmentUtils.setNodeEnvironment(env);
    });
  });
};
