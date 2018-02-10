import { EnvironmentUtils } from '../commons/utils/EnvironmentUtils';

export interface IConfig {
  color: string;
  env: string;
  coveo: {
    platformUrl: string;
  };
}

class Config {
  private env: string;

  constructor() {
    this.env = EnvironmentUtils.getNodeEnvironment() || 'production';
  }

  public getConfiguration(): IConfig {
    try {
      if (EnvironmentUtils.isTestRunning()) {
        return require(`../../environments/test.js`);
      } else {
        return require(`env/${this.env}.js`);
      }
    } catch (error) {
      throw new Error('Invalid environment');
    }
  }
}

export const config = new Config().getConfiguration();

// Used for test only
export const ConfigClass = Config;
