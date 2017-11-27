import * as chalk from 'chalk';

export interface IConfig {
  color: string;
  env: string;
  coveo: {
    platformUrl: string
  };
}

class Config {
  private env: string;
  private configuration: IConfig;

  constructor() {
    this.env = process.env.NODE_ENV || 'development';
  }

  public getEnvironment(): string {
    return this.env;
  }

  public getConfiguration(): IConfig {
    try {
      return require(`env/${this.env}.js`);
    } catch (error) {
      throw new Error('Invalid environment');
    }
  }
}

export const config = new Config().getConfiguration();
