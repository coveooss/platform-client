import * as _ from 'underscore';
import { flatten, unflatten } from 'flat';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';

export class JsonUtils {
  static SPACE: number = 2;

  static stringify(obj: any): string {
    return JSON.stringify(obj, undefined, JsonUtils.SPACE);
  }

  static flatten(jsonObject: any): any {
    return flatten(jsonObject);
  }

  /**
   * Remove key value pairs from the JSON object.
   *
   * @static
   * @param {*} obj JSON
   * @param {string[]} [keysToRemove=[]]
   * @param {string[]} [keysToOnlyInclude=[]]
   * @returns {*} any
   */
  // TODO: test
  static removeKeyValuePairsFromJson(obj: {}, keysToRemove: string[] = [], keysToOnlyInclude: string[] = []): {} {
    Assert.isNotUndefined(obj, 'Cannot apply flatten method to undefined object');
    if (keysToRemove.length + keysToOnlyInclude.length === 0) {
      // Do not waste time for nothing
      return obj;
    }

    let map = flatten(obj);

    map = _.omit(map, (value: any, key: string) => {
      const keys = key.split('.');
      if (keysToOnlyInclude.length > 0) {
        // Whitelist strategy
        return _.intersection(keys, keysToOnlyInclude).length === 0;
      } else {
        // Blacklist strategy
        return _.intersection(keys, keysToRemove).length > 0;
      }
    });

    return unflatten(map);
  }

  /**
   * Parse throught a JSON object and determine if the object contains the specified key
   *
   * @static
   * @param {*} obj
   * @param {string[]} [fields=[]]
   * @returns {boolean} Contains or not the specified key
   */
  static hasKey(obj: any, keysToFind: string[] = []): boolean {
    const map = flatten(obj);
    const noCommonElements = Object.keys(map).every((key: string) => {
      const keys = key.split('.');
      return _.intersection(keys, keysToFind).length === 0;
    });

    return !noCommonElements;
  }

  // TODO: unit test
  static clone(obj: any): any {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      Logger.error('Unable to clone JSON object', error);
      return null;
    }
  }
}
