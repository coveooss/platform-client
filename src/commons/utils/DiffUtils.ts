import * as _ from 'underscore';
import { flatten } from 'flat';
import { Dictionary, IClonable } from '../collections/Dictionary';
import { JsonUtils } from './JsonUtils';
import { DiffResultArray } from '../collections/DiffResultArray';

export interface IDiffOptions {
  /**
   * Specify which key to ignore during the Diff action. This is useful when a key always change from one Org to the other.
   * For instance id, createdDate, versionId, ...
   */
  keysToIgnore?: string[];
  /**
   * Specify which key to use for the Diff action. When defined, this option override the "keysToIgnore" option
   */
  includeOnly?: string[];
}

export class DiffUtils {
  static defaultOptions: IDiffOptions = {
    keysToIgnore: [],
    includeOnly: []
  };

  /**
   * Return the differences between 2 dictionaries
   *
   * @template T
   * @param {Dictionary<T>} dict1 Initial dictionary
   * @param {Dictionary<T>} dict2Copy Final dictionary
   * @param {IDiffOptions} [diffOptions]
   * @returns {IDiffResultArray<T>} Result between dictionnaries
   */

  static getDiffResult<T extends IClonable<T>>(dict1: Dictionary<T>, dict2: Dictionary<T>, diffOptions?: IDiffOptions): DiffResultArray<T> {
    let options: IDiffOptions = _.extend({}, DiffUtils.defaultOptions, diffOptions);

    // Make sure we don't alter the initial Dictionaries
    let dict2Copy = dict2.clone();
    let dict1Copy = dict1.clone();

    let diffResult: DiffResultArray<T> = new DiffResultArray();

    dict1Copy.keys().forEach((key: string) => {
      let value: T = dict1Copy.getItem(key);
      // Remove undesired fields from the diff result
      value = JsonUtils.removeKeyValuePairsFromJson(value, options.keysToIgnore, options.includeOnly);

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
      let deletedValue: T = JsonUtils.removeKeyValuePairsFromJson(dict2Copy.getItem(key), options.keysToIgnore, options.includeOnly);
      diffResult.DELETED.push(deletedValue);
    });

    return diffResult;
  }
}
