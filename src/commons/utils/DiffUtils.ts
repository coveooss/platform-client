// External packages
import { flatten } from 'flat';
// Internal packages
import { Dictionary } from '../collections/Dictionary';
import { IDiffResult } from './../interfaces/IDiffResult';
import { DiffResult } from '../../models/DiffResult';
import { JsonUtils } from './JsonUtils';
import * as _ from 'underscore';
import { IDiffResultArray } from '../interfaces/IDiffResult';

export class DiffUtils {
  static diff(json1: any, json2: any, fieldsToIgnore: Array<string>, recursiveFieldsRemoval: boolean = false): IDiffResult<any> {
    let diffResult: IDiffResult<any> = new DiffResult<any>();

    try {
      // Flatten the json so we can push only the differences and their paths in the result
      let flat1: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json1), fieldsToIgnore);
      let flat2: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json2), fieldsToIgnore);
      if (recursiveFieldsRemoval) {
        flat1 = JsonUtils.recurivelyRemoveFieldsFromJson(flat1, fieldsToIgnore);
        flat2 = JsonUtils.recurivelyRemoveFieldsFromJson(flat2, fieldsToIgnore);
      }

      flat1.Keys().forEach(function (key: string) {
        if (flat2.ContainsKey(key)) {
          // The key is in both dictionary, compare the values
          if (String(flat1.Item(key)) !== String(flat2.Item(key))) {
            // Values are different, add it
            // We always compare as if the first org would replace the second org config.
            diffResult.UPDATED.Add(key, 'OLD VALUE: ' + [flat2.Item(key) + ', NEW VALUE: ' + flat1.Item(key)]);
          }
        } else {
          // This is a new key, add it
          diffResult.NEW.Add(key, flat1.Item(key));
        }

        // Remove the item from the second json, so we will know at the end what has been removed in the first one
        flat2.Remove(key);
      });

      // Add the keys that were not in the first json to the deleted list
      flat2.Keys().forEach(function (key: string) {
        diffResult.DELETED.Add(key, flat2.Item(key));
      });
    } catch (err) {
      throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

  /**
   * Return the differences between 2 dictionaries
   *
   * @static
   * @template T
   * @param {Dictionary<T>} dict1 Initial dictionary
   * @param {Dictionary<T>} dict2 Final dictionary
   * @returns {IDiffResultArray<T>} Result between dictionnaries
   */
  static getDiffResult<T>(dict1: Dictionary<T>, dict2: Dictionary<T>): IDiffResultArray<T> {
    let diffResult: IDiffResultArray<T> = { NEW: [], UPDATED: [], DELETED: [] };

    try {
      dict1.Keys().forEach(function (key: string) {
        if (dict2.ContainsKey(key)) {
          if (!_.isEqual(dict1.Item(key), dict2.Item(key))) {
            diffResult.UPDATED.push(dict1.Item(key));
          }
        } else {
          diffResult.NEW.push(dict1.Item(key));
        }

        dict2.Remove(key);
      });

      // Add the keys that were not in the first json to the deleted list
      dict2.Keys().forEach(function (key: string) {
        diffResult.DELETED.push(dict2.Item(key));
      });
    } catch (err) {
      throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

  static diffDictionaryEntries(dict1: Dictionary<any>, dict2: Dictionary<any>): IDiffResult<string> {
    let diffResult: IDiffResult<string> = new DiffResult<string>();

    try {
      dict1.Keys().forEach(function (key: string) {
        if (dict2.ContainsKey(key)) {
          if (!_.isEqual(dict1.Item(key), dict2.Item(key))) {
            diffResult.UPDATED.Add(key, dict1.Item(key));
          }
        } else {
          // This is a new key, add it
          diffResult.NEW.Add(key, dict1.Item(key));
        }

        // Remove the items from the second json, so we will know at the end what has been removed in the first one
        dict2.Remove(key);
      });

      // Add the keys that were not in the first json to the deleted list
      dict2.Keys().forEach(function (key: string) {
        diffResult.DELETED.Add(key, dict2.Item(key));
      });
    } catch (err) {
      throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

  // TODO: Do not work. Need to create unit tests
  static diffArrays(array1: Array<any>, array2: Array<any>, fieldsToIgnore: Array<string>, checkOrdering?: boolean): IDiffResult<any> {
    checkOrdering = checkOrdering || false;

    let diffResult: IDiffResult<any> = new DiffResult<any>();

    DiffUtils.removeFieldsToIgnoreAndStringify(array1, fieldsToIgnore);
    DiffUtils.removeFieldsToIgnoreAndStringify(array2, fieldsToIgnore);

    array1.forEach(function (item: string) {
      if (array2.indexOf(item) === -1) {
        diffResult.NEW.Add('New element', item);
      }
    });

    if (!diffResult.ContainsItems() && array2.length > array1.length) {
      array2.forEach(function (item: string) {
        if (array1.indexOf(item) === -1) {
          diffResult.DELETED.Add('Deleted element', item);
        }
      });
    }

    if (checkOrdering && !diffResult.ContainsItems()) {
      let orderingHasChanged: boolean = false;

      for (let index = 0; index < array1.length; index++) {
        if (array1[index] !== array2[index]) {
          orderingHasChanged = true;
          diffResult.UPDATED.Add(
            'Ordering has changed',
            `The order of the elements in the array has changed, starting at item ${index}`
          );
          break;
        }
      }
    }

    return diffResult;
  }

  static removeFieldsToIgnoreAndStringify(array: Array<any>, fieldsToIgnore: Array<string>): void {
    for (let index = 0; index < array.length; index++) {
      array[index] = JSON.stringify(JsonUtils.removeFieldsFromJson(array[index], fieldsToIgnore));
    }
  }

  static addToResultIfDiffContainsItems(section: string, mainResultList: IDiffResult<any>, diffResult: IDiffResult<any>): IDiffResult<any> {
    if (diffResult.ContainsItems()) {
      mainResultList.UPDATED.Add(
        section,
        diffResult
      );
    }

    return mainResultList;
  }

  static addToMainDiff(addedDeletedmessage: string, mainDiff: Dictionary<IDiffResult<any>>, diffToAdd: Dictionary<IDiffResult<any>>): Dictionary<IDiffResult<any>> {
    // Create a first subsection for added and deleted items
    if (diffToAdd.ContainsKey('ADD_DELETE')) {
      mainDiff.Add(
        addedDeletedmessage,
        diffToAdd.Item('ADD_DELETE')
      );
      diffToAdd.Remove('ADD_DELETE');
    }

    // Create other subsections for updated items, if any.
    if (diffToAdd.Count() > 0) {
      diffToAdd.Keys().forEach(function (key: string) {
        mainDiff.Add(
          key,
          diffToAdd.Item(key)
        );
      });
    }

    return mainDiff;
  }
}

