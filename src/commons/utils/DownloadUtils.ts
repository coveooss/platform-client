import * as _ from 'underscore';
import { Dictionary, IClonable } from '../collections/Dictionary';
import { JsonUtils } from './JsonUtils';
import { DownloadResultArray } from '../collections/DownloadResultArray';
import { IDownloadOptions } from '../../commands/DownloadCommand';
export class DownloadUtils {
  static defaultOptions: IDownloadOptions = {
    dummy: ''
  };

  /**
   * Return the differences between 2 dictionaries
   *
   * @template T
   * @param {Dictionary<T>} dict1 Initial dictionary
   * @param {Dictionary<T>} dict2Copy Final dictionary
   * @param {IDownloadOptions} [diffOptions]
   * @returns {IDiffResultArray<T>} Result between dictionnaries
   */
  static getDownloadResult<T extends IClonable<T>>(dict1: Dictionary<T>): DownloadResultArray<T> {
    const options: IDownloadOptions = _.extend({}, DownloadUtils.defaultOptions);
    const downloadResult: DownloadResultArray<T> = new DownloadResultArray();
    dict1.keys().forEach((key: string) => {
      const value: T = dict1.getItem(key);
      downloadResult.ITEMS.push(value);
    });

    return downloadResult;
  }
}
