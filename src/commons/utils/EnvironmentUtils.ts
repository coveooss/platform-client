export interface IConfig {
  color: string;
  env: string;
  coveo: {
    platformUrl: string;
  };
}

class EnvironmentUtilsSingleton {
  private static logger: EnvironmentUtilsSingleton = new EnvironmentUtilsSingleton();
  private env: string = 'production';

  static getInstance(): EnvironmentUtilsSingleton {
    return this.logger;
  }

  setNodeEnvironment(env: string) {
    this.env = env;
  }

  setDefaultNodeEnvironment() {
    this.env = 'production';
  }

  getNodeEnvironment(): string | undefined {
    return this.env;
  }

  isTestRunning(): boolean {
    return this.env === 'test';
  }

  getConfiguration(): IConfig {
    try {
      if (EnvironmentUtils.isTestRunning()) {
        return require(`../../../environments/test.js`);
      } else {
        return require(`env/${this.env}.js`);
      }
    } catch (error) {
      throw new Error('Invalid environment');
    }
  }
}

export let EnvironmentUtils = EnvironmentUtilsSingleton.getInstance();
