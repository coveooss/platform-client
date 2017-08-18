// External packages
import {flatten} from 'flat';
// Internal packages
import { Dictionary } from '../collections/Dictionary';

export class JsonUtils {
  static flatten(jsonObject:any): any {
    return flatten(jsonObject);
  }

  static removeFieldsFromJson(json:any, fieldsToIgnore?:Array<string>): any {
    let ignoreList = fieldsToIgnore || new Array<string>();

    Object.keys(json).forEach(key => {
      if (ignoreList.indexOf(key) > -1) {
        delete json[key];
      }
    });

    return json;
  }

  static convertJsonToDictionary(json:any, fieldsToIgnore?:Array<string>): Dictionary<any> {
    let ignoreList = fieldsToIgnore || new Array<string>();
    let newDictionary: Dictionary<any> = new Dictionary<any>();

    Object.keys(json).forEach(key => {
      if (ignoreList.indexOf(key) == -1) {
        newDictionary.Add(key, json[key]);
      }
    });

    return newDictionary;
  }
}