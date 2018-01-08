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
    this.env = process.env.NODE_ENV || 'development';
  }

  public isTestRunning(): boolean {
    return this.env === 'test';
  }

  public getConfiguration(): IConfig {
    try {
      if (this.isTestRunning()) {
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
