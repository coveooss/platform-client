class EnvironmentUtilsSingleton {
  private static logger: EnvironmentUtilsSingleton = new EnvironmentUtilsSingleton();
  private env: string = process.env.NODE_ENV || 'production';

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
}

export let EnvironmentUtils = EnvironmentUtilsSingleton.getInstance();
