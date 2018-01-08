import { config } from './../../src/config/index';

export const configTest = () => {
  describe('Config', () => {
    it('Should return the current environment', () => {
      config.env = 'test';
    });
  });
};
