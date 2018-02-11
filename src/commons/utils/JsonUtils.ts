import * as _ from 'underscore';
import { flatten, unflatten } from 'flat';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';

export class JsonUtils {
  static stringify(obj: any, space: number = 2): string {
    return JSON.stringify(obj, undefined, space);
  }

  static flatten(jsonObject: any): any {
    return flatten(jsonObject);
  }

  /**
   * Remove key value pairs from the JSON object. Noth that the parameter 'exclusiveKeys' take precedence over the parameter 'keysToRemove'.
   * This means that if you specify both parameters, only the 'exclusiveKeys' will be taken in consideration
   *
   * @static
   * @param {*} obj JSON
   * @param {string[]} [keysToRemove=[]]
   * @param {string[]} [exclusiveKeys=[]]
   * @returns {*} any
   */
  static removeKeyValuePairsFromJson(obj: {}, keysToRemove: string[] = [], exclusiveKeys: string[] = []): {} {
    Assert.isNotUndefined(obj, 'Cannot apply flatten method to undefined object');
    if (keysToRemove.length + exclusiveKeys.length === 0) {
      // Do not waste time for nothing
      return obj;
    }

    let map = flatten(obj);

    map = _.omit(map, (value: any, key: string) => {
      const keys = key.split('.');
      if (exclusiveKeys.length > 0) {
        // Whitelist strategy
        return _.intersection(keys, exclusiveKeys).length === 0;
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

  static clone(obj: any): any {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      Logger.error('Unable to clone JSON object', error);
      return null;
    }
  }
}
