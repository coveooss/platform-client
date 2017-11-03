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
      Logger.info(`Loading ${chalk.underline(this.env)} environment`);
      return require(`env/${this.env}.js`);
    } catch (error) {
      Logger.error('Unable to load environment.\nFallback on Development environment.', error);

      // TODO: fix this!
      // Hack since aliases will not work in developing mode
      return {
        workingDirectory: './',
        color: 'green',
        env: 'development',
        coveo: { platformUrl: 'https://platformdev.cloud.coveo.com' }
      };
      // throw new Error('Invalid environment');
    }
  }
}

export const config = new Config().getConfiguration();
