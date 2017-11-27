import { Dictionary } from '../collections/Dictionary';
import { StaticErrorMessage } from '../errors';
import * as request from 'request';

export class RequestUtils {
  static get(url: string, apiKey: string): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        url,
        {
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode === 200) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        });
    });
  }

  static post(url: string, apiKey: string, data: any): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        url,
        {
          method: 'POST',
          body: data,
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode && response.statusCode >= 200 && response.statusCode < 300) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        });
    });
  }
  static put(url: string, apiKey: string, data: any): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        url,
        {
          method: 'PUT',
          body: data,
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode === 201 || response.statusCode === 204) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        });
    });
  }

  static delete(url: string, apiKey: string): Promise<request.RequestResponse>  {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        url,
        {
          method: 'DELETE',
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode === 201 || response.statusCode === 204) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        });
    });
  }
}
