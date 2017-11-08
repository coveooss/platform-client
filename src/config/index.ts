import { Logger } from '../commons/logger';
import * as chalk from 'chalk';
declare const PP: any;

export interface IConfig {
  workingDirectory: string;
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

  public getConfiguration(): IConfig {
    try {
      Logger.info(`Loading ${chalk.underline(this.env)} environment configuration`);
      return require(`env/${this.env}.js`);
    } catch (error) {
      Logger.error('Unable to load environment.', error);
      throw new Error('Invalid environment');
    }
  }
}

export const config = new Config().getConfiguration();
