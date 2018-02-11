import * as chalk from 'chalk';

/**
 * The purpose of this class is to have specific colors for an object type.
 *
 * @class Colors
 */
export class Colors {
  static organization(value: string): string {
    return chalk.cyan(value);
  }

  static number(value: string): string {
    return chalk.yellow(value);
  }

  static filename(value: string): string {
    return chalk.underline(value);
  }

  static success(value: string): string {
    return chalk.green(value);
  }

  static error(value: string): string {
    return chalk.red(value);
  }
}
