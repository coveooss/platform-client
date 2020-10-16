import { isNumber, isString } from 'underscore';
import { Utils } from '../utils/Utils';

/* istanbul ignore next */
export class Assert {
  static failureHandler = (message?: string) => {
    if (message && Utils.isNonEmptyString(message)) {
      throw new Error(message);
    } else {
      throw new Error('Assertion Failed!');
    }
  };

  static fail(message?: string) {
    Assert.failureHandler(message);
  }

  static check(condition: boolean, message?: string) {
    if (!condition) {
      Assert.fail(message);
    }
  }

  static isUndefined(obj: any, message: string = 'Value should be undefined.') {
    Assert.check(Utils.isUndefined(obj), message);
  }

  static isNotUndefined(obj: any, message: string = 'Value should not be undefined.') {
    Assert.check(!Utils.isUndefined(obj), message);
  }

  static isNull(obj: any, message: string = 'Value should be null.') {
    Assert.check(Utils.isNull(obj), message);
  }

  static isNotNull(obj: any, message: string = 'Value should not be null.') {
    Assert.check(!Utils.isNull(obj), message);
  }

  static exists(obj: any, message: string = 'Value should not be null or undefined') {
    Assert.check(!Utils.isNullOrUndefined(obj), message);
  }

  static doesNotExists(obj: any, message: string = 'Value should be null or undefined') {
    Assert.check(Utils.isNullOrUndefined(obj), message);
  }

  static isString(obj: any, message: string = 'Value should be a string.') {
    Assert.check(isString(obj), 'Value should be a string.');
  }

  static stringStartsWith(str: string, start: string) {
    Assert.isNonEmptyString(str);
    Assert.isNonEmptyString(start);
    Assert.check(str.indexOf(start) === 0, 'Value should start with ' + start);
  }

  static isNonEmptyString(str: string, message: string = 'Value should be a non-empty string.') {
    Assert.check(Utils.isNonEmptyString(str), message);
  }

  static isNumber(obj: any, message: string = 'Value should be a number.') {
    Assert.check(isNumber(obj), message);
  }

  static isLargerThan(expected: number, actual: number) {
    Assert.check(actual > expected, 'Value ' + actual + ' should be larger than ' + expected);
  }

  static isLargerOrEqualsThan(expected: number, actual: number, message?: string) {
    message ? message : 'Value ' + actual + ' should be larger or equal than ' + expected;
    Assert.check(actual >= expected, message);
  }

  static isSmallerThan(expected: number, actual: number, message?: string) {
    message ? message : 'Value ' + actual + ' should be smaller than ' + expected;
    Assert.check(actual < expected, message);
  }

  static isSmallerOrEqualsThan(expected: number, actual: number, message?: string) {
    message ? message : 'Value ' + actual + ' should be smaller or equal than ' + expected;
    Assert.check(actual <= expected, message);
  }
}
