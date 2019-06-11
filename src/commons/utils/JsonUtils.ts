import { flatten, unflatten } from 'flat';
import * as _ from 'underscore';
import { isObject } from 'util';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';

export class JsonUtils {
  static stringify(obj: any, space: number = 2): string {
    return JSON.stringify(obj, undefined, space);
  }

  static unflatten(jsonObject: any): any {
    return unflatten(jsonObject);
  }

  static flatten(jsonObject: any): any {
    return flatten(jsonObject);
  }

  /**
   * Remove key value pairs from the JSON object. Note that the parameter 'exclusiveKeys' take precedence over the parameter 'keysToRemove'.
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

    Assert.check(!Array.isArray(obj), 'Should not flatten arrays');
    let map = flatten(obj);

    const omit = (keys: string[], initialMatchCondition: boolean) => {
      return _.omit(map, (value: any, key: string) => {
        const _key = key.split('.');
        let match;

        for (let i = 0; i < keys.length; i++) {
          match = initialMatchCondition;
          const _str = keys[i].split('.');
          for (let j = 0; j < _str.length; j++) {
            if (_key[j] !== _str[j]) {
              match = !initialMatchCondition;
              break;
            }
          }
          if (match === initialMatchCondition) {
            break;
          }
        }
        return match;
      });
    };

    // First pass - whitelist strategy
    if (exclusiveKeys.length > 0) {
      map = omit(exclusiveKeys, false);
    }

    // Second pass - blacklist strategy
    if (keysToRemove.length > 0) {
      map = omit(keysToRemove, true);
    }

    return unflatten(map);
  }

  /**
   * Parse throught a JSON object and determine if the object contains the specified key
   *
   * @static
   * @param {*} obj
   * @param {string[]} [keysToFind=[]]
   * @returns {boolean} Contains or not the specified key
   */
  static hasKey(obj: any, keysToFind: string[] = []): boolean {
    const map: {} = flatten(obj);
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

  static sortObjectProperties(unordered: any, deep: boolean = false): any {
    const ordered: any = {};
    Object.keys(unordered)
      .sort()
      .forEach((key: string) => {
        let value: any = unordered[key];
        if (deep && isObject(value)) {
          value = JsonUtils.sortObjectProperties(value, deep);
        }
        ordered[key] = value;
      });
    return ordered;
  }
}
