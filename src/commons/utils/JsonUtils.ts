import * as _ from 'underscore';
import { IStringMap } from '../interfaces/IStringMap';
import { flatten, unflatten } from 'flat';
import { Dictionary } from '../collections/Dictionary';
import { Logger } from '../logger';

export class JsonUtils {
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
  static removeKeyValuePairsFromJson(obj: any, keysToRemove: string[] = [], keysToOnlyInclude: string[] = []): any {
    if (keysToRemove.length + keysToOnlyInclude.length === 0) {
      // Do not waste time for nothing
      return obj;
    }

    let map = flatten(obj);

    map = _.omit(map, (value: any, key: string) => {
      let keys = key.split('.');
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
    let noCommonElements = Object.keys(map).every((key: string) => {
      let keys = key.split('.');
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
