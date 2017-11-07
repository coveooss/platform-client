import { Dictionary } from '../collections/Dictionary';
import { IStringMap } from '../interfaces/IStringMap';
import { flatten, unflatten } from 'flat';
import * as _ from 'underscore';

export class JsonUtils {
  static flatten(jsonObject: any): any {
    return flatten(jsonObject);
  }

  // TODO: old-> remove
  static removeFieldsFromJsonOld(json: any, fieldsToIgnore: string[] = []): any {
    Object.keys(json).forEach((key: string) => {
      if (fieldsToIgnore.indexOf(key) > -1) {
        delete json[key];
      }
    });

    return json;
  }

  static removeFieldsFromJson(obj: any, fields: string[] = []): any {
    if (fields.length === 0) {
      // Do not waste time for nothing
      return obj;
    }

    let map = flatten(obj);

    map = _.omit(map, (value: any, key: string) => {
      let keys = key.split('.');
      return _.intersection(keys, fields).length > 0;
    });

    return unflatten(map);
  }

  static hasKey(obj: any, fields: string[] = []): boolean {
    const map = flatten(obj);
    let noCommonElements = Object.keys(map).every((key: string) => {
      let keys = key.split('.');
      return _.intersection(keys, fields).length === 0;
    });

    return !noCommonElements;
  }

  // TODO: old-> remove
  static recurivelyRemoveFieldsFromJson(items: Dictionary<any>, fieldsToIgnore?: string[]): Dictionary<any> {
    let ignoreList = fieldsToIgnore || new Array<string>();
    items.Keys().forEach((key: string) => {
      ignoreList.forEach((field: string) => {
        if (key.indexOf('.' + field + '.') > -1 || key.lastIndexOf('.' + field, key.length - (field.length + 1)) === key.length - (field.length + 1)) {
          items.Remove(key);
        }
      });
    });

    return items;
  }

  static convertJsonToDictionary(json: any, fieldsToIgnore?: string[]): Dictionary<any> {
    let ignoreList = fieldsToIgnore || new Array<string>();
    let newDictionary: Dictionary<any> = new Dictionary<any>();

    Object.keys(json).forEach((key: string) => {
      if (ignoreList.indexOf(key) === -1) {
        newDictionary.Add(key, json[key]);
      }
    });

    return newDictionary;
  }
}
