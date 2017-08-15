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

    // Flatten the json so we can push only the differences and their paths in the result
    let flat1: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json1), fieldsToIgnore);
    let flat2: Dictionary<any> = JsonUtils.convertJsonToDictionary(flatten(json2), fieldsToIgnore);

    // Diff the provided jsons
    for (let key in flat1.Keys) {
        if (flat2.ContainsKey(key)) {
            // The key is in both dictionary, compare the values
            if (flat1.Item(key) != flat2.Item(key)) {
                // Values are different, add it
                // We always compare as if the first org would replace the second org config.
                diffResult.UPDATED.old.Add(key, flat2.Item(key));
                diffResult.UPDATED.new.Add(key, flat1.Item(key));
            }
        } else {
            // This is a new key, add it
            diffResult.NEW.Add(key, flat1.Item(key));
        }

        // Remove the item from the second json, so we will know at the end what has been removed in the first one
        flat2.Remove(key);
    }

    // Add the keys that were not in the first json to the deleted list
    for (let key in flat2.Keys) {
        diffResult.DELETED.Add(key, flat2.Item(key));
    }

    // Return the diff results to the caller.
    return diffResult;
  }
}
