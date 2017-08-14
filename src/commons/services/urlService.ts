import { ObjectUtils } from '../utils/objectUtils';
import { config } from './../../config/index';
const URLSearchParams = require('url-search-params');

export class UrlService {
  static platformUrl: string = 'https://platform.cloud.coveo.com';

  /*** Fields API ***/
  static getFieldUrl(organizationId: string, options?: any): string {
    return `${config.platformUrl}/rest/organizations/${organizationId}/indexes/page/fields${this.serialize(options)}`;
  }

  /**
   * Serializes the form element so it can be passed to the back end through the url.
   * The objects properties are the keys and the objects values are the values.
   * ex: { "a":1, "b":2, "c":3 } would look like ?a=1&b=2&c=3
   * @param  {any} obj - The options to be url encoded
   * @returns string - The url encoded string
   */
  static serialize(obj: any): string {
    let containParams = false;
    const params: URLSearchParams = new URLSearchParams();

    for (const key in obj) {
      if (obj.hasOwnProperty(key) && ObjectUtils.exists(obj[key])) {
        containParams = true;
        const element = obj[key];
        params.set(key, element.toString());
      }
    }

    const queryString = containParams ? '?' : '';
    return `${queryString}${ObjectUtils.anyTypeToString(params)}`;
  }
}
