export class EnvironmentUtils {
  static setNodeEnvironment(env: string) {
    process.env.NODE_ENV = env;
  }

  static getNodeEnvironment(): string | undefined {
    return process.env.NODE_ENV;
  }

  static isTestRunning(): boolean {
    return process.env.NODE_ENV === 'test';
  }
}
