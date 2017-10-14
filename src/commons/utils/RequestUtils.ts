// External packages
let syncrequest = require('sync-request');
// Internal packages
import { Dictionary } from '../collections/Dictionary';
import { StaticErrorMessage } from '../errors'
import * as request from 'request';

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

  static get(url: string, apiKey: string): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        url,
        {
          auth: { 'bearer': apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            resolve(response)
          }
        })
    });
  }

  static post(url: string, apiKey: string, body: any): any {
    let jsonResponse: any = null;

    let response = syncrequest(
      'POST',
      url,
      {
        headers: {
          'authorization': 'Bearer ' + apiKey
        }
      }
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      jsonResponse = JSON.parse(response.getBody('utf-8'));
    } else {
      // TODO: need to make a better response in the console
      throw new Error(`${StaticErrorMessage.UNABLE_TO_API_REQUEST}::${url}::${JSON.parse(response.getBody('utf-8'))}`);
    }

    return jsonResponse;
  }

  static put(url: string, apiKey: string, body: any): any {
    let jsonResponse: any = null;

    let response = syncrequest(
      'PUT',
      url,
      {
        headers: {
          'authorization': 'Bearer ' + apiKey
        }
      }
    );

    if (response.statusCode >= 200 && response.statusCode < 300) {
      jsonResponse = JSON.parse(response.getBody('utf-8'));
    } else {
      // TODO: need to make a better response in the console
      throw new Error(`${StaticErrorMessage.UNABLE_TO_API_REQUEST}::${url}::${JSON.parse(response.getBody('utf-8'))}`);
    }

    return jsonResponse;
  }

  // TODO
  static delete(url: string, apiKey: string, body: any): any {
  }
}
