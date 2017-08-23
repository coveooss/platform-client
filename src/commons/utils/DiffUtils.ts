// External packages
import {flatten} from 'flat';
// Internal packages
import { Dictionary } from '../collections/Dictionary';
import { IDiffResult } from './../interfaces/IDiffResult';
import { DiffResult } from '../../models/DiffResult';
import { JsonUtils } from './JsonUtils';

export class DiffUtils {
  static diff(json1: any, json2: any, fieldsToIgnore: Array<string>): IDiffResult<any> {
    let diffResult: IDiffResult<any> = new DiffResult<any>();

    try {
        // Flatten the json so we can push only the differences and their paths in the result
        let flat1: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json1), fieldsToIgnore);
        let flat2: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json2), fieldsToIgnore);

        flat1.Keys().forEach(function (key: string){
            if (flat2.ContainsKey(key)) {
                // The key is in both dictionary, compare the values
                if (String(flat1.Item(key)) !== String(flat2.Item(key))) {
                    // Values are different, add it
                    // We always compare as if the first org would replace the second org config.
                    diffResult.UPDATED_OLD.Add(key, flat2.Item(key));
                    diffResult.UPDATED_NEW.Add(key, flat1.Item(key));
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

  static diffDictionaryEntries(dict1: Dictionary<any>, dict2: Dictionary<any>): IDiffResult<string> {
    let diffResult: IDiffResult<any> = new DiffResult<any>();

    try {
        dict1.Keys().forEach(function (key: string){
            if (dict2.ContainsKey(key)) {
                // The key is in both dictionary, mark it as "update"
                diffResult.UPDATED_NEW.Add(key, `Possible source update ${key}`);
            } else {
                // This is a new key, add it
                diffResult.NEW.Add(key, `A source was added: ${key}`);
            }

            // Remove the item from the second json, so we will know at the end what has been removed in the first one
            dict2.Remove(key);
        });

        // Add the keys that were not in the first json to the deleted list
        dict2.Keys().forEach(function (key: string) {
            diffResult.DELETED.Add(key, `A source was deleted: ${key}`);
        });
    } catch (err) {
        throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

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
                diffResult.UPDATED_NEW.Add(
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
        mainResultList.UPDATED_NEW.Add(
            section,
            diffResult
        );
    }

    return mainResultList;
  }

  static addToMainDiff (addedDeletedmessage: string, mainDiff: Dictionary<IDiffResult<any>>, diffToAdd: Dictionary<IDiffResult<any>>): Dictionary<IDiffResult<any>> {
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

