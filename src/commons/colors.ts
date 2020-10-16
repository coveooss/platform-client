import { bold, blue, cyan, yellow, underline, green, red } from 'chalk';

/**
 * The purpose of this class is to have specific colors for an object type.
 *
 * @class Colors
 */
/* istanbul ignore next */
export class Colors {
  static organization(value: string): string {
    return bold.cyan(value);
  }

  static page(value: string): string {
    return blue(value);
  }

  static extension(value: string): string {
    return cyan(value);
  }

  static source(value: string): string {
    return cyan(value);
  }

  static number(value: string): string {
    return yellow(value);
  }

  static filename(value: string): string {
    return underline(value);
  }

  static success(value: string): string {
    return green(value);
  }

  static error(value: string): string {
    return red(value);
  }

  static warn(value: string): string {
    return yellow(value);
  }
}
