import { expect } from 'chai';
import { EnvironmentUtils } from '../../src/commons/utils/EnvironmentUtils';

export const configTest = () => {
  describe('Config', () => {
    beforeEach(() => {
      EnvironmentUtils.setDefaultNodeEnvironment();
    });

    it('Should load qa qa envioment', () => {
      EnvironmentUtils.setNodeEnvironment('qa');
      expect(EnvironmentUtils.getNodeEnvironment()).to.equal('qa');
      expect(EnvironmentUtils.getConfiguration().env).to.equal('qa');
      expect(EnvironmentUtils.getConfiguration().coveo.platformUrl).to.equal('https://platformqa.cloud.coveo.com');
    });

    it('Should load an invalid envioment', () => {
      EnvironmentUtils.setNodeEnvironment('invalid');
      expect(() => EnvironmentUtils.getConfiguration()).to.throw();
    });
  });
};
