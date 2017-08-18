// External packages
import {flatten} from 'flat';
// Internal packages
import { Dictionary } from '../collections/Dictionary';
import { IDiffResult } from './../interfaces/IDiffResult';
import { DiffResult } from '../../models/DiffResult';
import { JsonUtils } from './JsonUtils';

export class DiffUtils {
  static diff(json1: any, json2: any, fieldsToIgnore: Array<string>): IDiffResult<any> {
    let diffResult:IDiffResult<any> = new DiffResult<any>();

    try {
        // Flatten the json so we can push only the differences and their paths in the result
        let flat1: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json1), fieldsToIgnore);
        let flat2: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json2), fieldsToIgnore);

        flat1.Keys().forEach(function (key){
            if (flat2.ContainsKey(key)) {
                // The key is in both dictionary, compare the values
                if (flat1.Item(key) != flat2.Item(key)) {
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
        flat2.Keys().forEach(function (key) {
            diffResult.DELETED.Add(key, flat2.Item(key));
        });
    } catch (err) {
        throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

  static diffDictionaryEntries(dict1: Dictionary<any>, dict2: Dictionary<any>): IDiffResult<string> {
    let diffResult:IDiffResult<any> = new DiffResult<any>();

    try {
        dict1.Keys().forEach(function (key){
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
        dict2.Keys().forEach(function (key) {
            diffResult.DELETED.Add(key, `A source was deleted: ${key}`);
        });
    } catch (err) {
        throw new Error('An error occured while processing the diff: ' + err);
    }

    // Return the diff results to the caller.
    return diffResult;
  }

  static diffArrays(array1: Array<any>, array2: Array<any>, fieldsToIgnore: Array<string>): IDiffResult<any> {
    let diffResult: IDiffResult<any> = new DiffResult<any>();

    array1.forEach(function (item) {
        console.log(item);
    });

    return diffResult;
  }
}

