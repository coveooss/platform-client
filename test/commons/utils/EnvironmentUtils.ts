import { expect } from 'chai';
import { EnvironmentUtils } from '../../../src/commons/utils/EnvironmentUtils';

export const EnvironmentUtilsTest = () => {
  describe('Config', () => {
    afterEach(() => {
      EnvironmentUtils.setNodeEnvironment('test');
    });

    it('Should set the current environment', () => {
      EnvironmentUtils.setNodeEnvironment('superTest');
      expect(process.env.NODE_ENV).to.eql('superTest');
    });

    it('Should set the current environment to development', () => {
      EnvironmentUtils.setDefaultNodeEnvironment();
      expect(process.env.NODE_ENV).to.eql('development');
    });
  });
};
