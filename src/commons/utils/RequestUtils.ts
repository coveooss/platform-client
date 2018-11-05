import * as request from 'request';
import { JsonUtils } from './JsonUtils';

export class RequestUtils {
  static OK: number = 200;
  static CREATED: number = 201;
  static NO_CONTENT: number = 204;
  static REDIRECTION: number = 300;
  static ACCESS_DENIED: number = 403;

  static get(uri: string, apiKey: string): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        uri,
        {
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode === RequestUtils.OK) {
              resolve(response);
            } else {
              reject(JsonUtils.stringify(response.body));
            }
          }
        }
      );
    });
  }

  static post(uri: string, apiKey: string, data: any): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        uri,
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
            if (response.statusCode && response.statusCode >= RequestUtils.OK && response.statusCode < RequestUtils.REDIRECTION) {
              resolve(response);
            } else {
              reject(JsonUtils.stringify(response.body));
            }
          }
        }
      );
    });
  }

  static put(uri: string, apiKey: string, data: any): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        uri,
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
            if (
              response.statusCode === RequestUtils.OK ||
              response.statusCode === RequestUtils.CREATED ||
              response.statusCode === RequestUtils.NO_CONTENT
            ) {
              resolve(response);
            } else {
              reject(JsonUtils.stringify(response.body));
            }
          }
        }
      );
    });
  }

  static delete(uri: string, apiKey: string): Promise<request.RequestResponse> {
    return new Promise((resolve: (value?: any | Thenable<{}>) => void, reject: (error: any) => void) => {
      request(
        uri,
        {
          method: 'DELETE',
          auth: { bearer: apiKey },
          json: true
        },
        (err: any, response: request.RequestResponse) => {
          if (err) {
            reject(err);
          } else {
            if (response.statusCode === RequestUtils.NO_CONTENT) {
              resolve(response);
            } else {
              reject(JsonUtils.stringify(response.body));
            }
          }
        }
      );
    });
  }
}
