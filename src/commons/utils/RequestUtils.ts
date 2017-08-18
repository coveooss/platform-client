// External packages
let syncrequest = require('sync-request');
import * as request from 'request';
// Internal packages
import { Dictionary } from '../collections/Dictionary';
import { StaticErrorMessage } from '../errors'

export class RequestUtils {
  static getRequestAndReturnJson(url: string, apiKey: string): any {
    let jsonResponse: any = null;

    let response = syncrequest(
      'GET',
      url,
      {
        'headers': {
          'authorization': 'Bearer ' + apiKey
        }
      }
    );

    if (response.statusCode === 200) {
        jsonResponse = JSON.parse(response.getBody('utf-8'));
    } else {
        // TODO: need to make a better response in the console
       throw new Error(`${StaticErrorMessage.UNABLE_TO_API_REQUEST}::${url}::${JSON.parse(response.getBody('utf-8'))}`);
    }

    return jsonResponse;
  }
}
