export class EnvironmentUtils {
  static setNodeEnvironment(env: string) {
    process.env.NODE_ENV = env;
  }

  static setDefaultNodeEnvironment() {
    process.env.NODE_ENV = 'development';
  }

  static getNodeEnvironment(): string | undefined {
    return process.env.NODE_ENV;
  }

  static isTestRunning(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}
