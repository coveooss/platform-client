import * as _ from 'underscore';

export class Utils {
  static isUndefined(obj: any): boolean {
    return typeof obj === 'undefined';
  }

  static isNull(obj: any): boolean {
    return obj === null;
  }

  static isNullOrUndefined(obj: any): boolean {
    return Utils.isUndefined(obj) || Utils.isNull(obj);
  }

  static exists(obj: any): boolean {
    return !Utils.isNullOrUndefined(obj);
  }

  static toNotNullString(str: string): string {
    return _.isString(str) ? str : '';
  }

  static anyTypeToString(value: any): string {
    return value ? value.toString() : '';
  }

  static isNullOrEmptyString(str: string): boolean {
    return Utils.isNullOrUndefined(str) || !Utils.isNonEmptyString(str);
  }

  static isNonEmptyString(str: string): boolean {
    return _.isString(str) && str !== '';
  }

  static isEmptyString(str: string): boolean {
    return !Utils.isNonEmptyString(str);
  }

  static stringStartsWith(str: string, startWith: string): boolean {
    return str.slice(0, startWith.length) === startWith;
  }

  static isNonEmptyArray(obj: any): boolean {
    return _.isArray(obj) && obj.length > 0;
  }

  static isEmptyArray(obj: any): boolean {
    return !Utils.isNonEmptyArray(obj);
  }
}
