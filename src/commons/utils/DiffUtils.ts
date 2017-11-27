import * as _ from 'underscore';
import { flatten } from 'flat';
import { Dictionary } from '../collections/Dictionary';
import { JsonUtils } from './JsonUtils';
import { DiffResultArray } from '../../coveoObjects/DiffResultArray';

export interface IDiffOptions {
  fieldsToIgnore?: string[];
}

export class DiffUtils {
  static defaultOptions: IDiffOptions = {
    fieldsToIgnore: []
  };

  /**
   * Return the differences between 2 dictionaries
   *
   * @template T
   * @param {Dictionary<T>} dict1 Initial dictionary
   * @param {Dictionary<T>} dict2Copy Final dictionary
   * @returns {IDiffResultArray<T>} Result between dictionnaries
   */

  static getDiffResult<T>(dict1: Dictionary<T>, dict2: Dictionary<T>, diffOptions?: IDiffOptions): DiffResultArray<T> {
    let options: IDiffOptions = _.extend({}, DiffUtils.defaultOptions, diffOptions);

    // Make sure we don't alter the initial Dictionaries
    let dict2Copy = dict2.clone();
    let dict1Copy = dict1.clone();

    let diffResult: DiffResultArray<T> = new DiffResultArray();

    dict1Copy.keys().forEach((key: string) => {
      let value: T = dict1Copy.getItem(key);
      // Remove undesired fields from the diff result
      value = JsonUtils.removeKeyValuePairsFromJson(value, options.fieldsToIgnore);

      if (dict2Copy.containsKey(key)) {
        if (!_.isEqual(value, dict2Copy.getItem(key))) {
          diffResult.UPDATED.push(value);
        }
      } else {
        diffResult.NEW.push(value);
      }

      dict2Copy.remove(key);
    });

    // Add the keys that were not in the first json to the deleted list
    dict2Copy.keys().forEach((key: string) => {
      diffResult.DELETED.push(dict2Copy.getItem(key));
    });

    return diffResult;
  }
}
