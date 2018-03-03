import { BaseCoveoObject } from '../../coveoObjects/BaseCoveoObject';
import { Dictionary } from '../collections/Dictionary';
import { DownloadResultArray } from '../collections/DownloadResultArray';
export class DownloadUtils {
  /**
   * Return the differences between 2 dictionaries
   *
   * @template T
   * @param {Dictionary<T>} dict1 Initial dictionary
   * @param {Dictionary<T>} dict2Copy Final dictionary
   * @param {IDownloadOptions} [diffOptions]
   * @returns {IDiffResultArray<T>} Result between dictionnaries
   */
  static getDownloadResult(dict1: Dictionary<BaseCoveoObject>): DownloadResultArray {
    const downloadResult: DownloadResultArray = new DownloadResultArray();
    dict1.keys().forEach((key: string) => {
      const value: BaseCoveoObject = dict1.getItem(key);
      downloadResult.add(value);
    });

    return downloadResult;
  }
}
