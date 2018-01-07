import * as request from 'request';

export class RequestUtils {
  static OK: number = 200;
  static CREATED: number = 201;
  static NO_CONTENT: number = 204;
  static REDIRECTION: number = 300;

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
            if (response.statusCode === RequestUtils.OK) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        }
      );
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
            if (response.statusCode && response.statusCode >= RequestUtils.OK && response.statusCode < RequestUtils.REDIRECTION) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        }
      );
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
            if (response.statusCode === RequestUtils.CREATED || response.statusCode === RequestUtils.NO_CONTENT) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        }
      );
    });
  }

  static delete(url: string, apiKey: string): Promise<request.RequestResponse> {
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
            if (response.statusCode === RequestUtils.CREATED || response.statusCode === RequestUtils.NO_CONTENT) {
              resolve(response);
            } else {
              reject(JSON.stringify(response.body));
            }
          }
        }
      );
    });
  }
}
