import { expect } from 'chai';
import { EnvironmentUtils } from '../../../src/commons/utils/EnvironmentUtils';

export const EnvironmentUtilsTest = () => {
  describe('Config', () => {
    afterEach(() => {
      EnvironmentUtils.setNodeEnvironment('test');
    });

    it('Should set the current environment', () => {
      EnvironmentUtils.setNodeEnvironment('superTest');
      expect(EnvironmentUtils.getNodeEnvironment()).to.eql('superTest');
    });

    it('Should set the current environment to production', () => {
      EnvironmentUtils.setDefaultNodeEnvironment();
      expect(EnvironmentUtils.getNodeEnvironment()).to.eql('production');
    });
  });
};
