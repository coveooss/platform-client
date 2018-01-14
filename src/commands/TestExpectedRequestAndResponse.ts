import * as request from 'request';
import * as url from 'url';
import { Assert } from '../commons/misc/Assert';

export class TestExpectedRequestAndResponse {
  public method: string;
  public path: string;
  public queryString: string[];
  public formData: string[];
  public body: any;

  constructor() {
    // const response : XMLHttpRequest;
    // response.setStatusCode(200);
  }

  public validate(uri: string, options: request.CoreOptions): void {
    // Validating HTTP method
    if (this.method) {
      Assert.check(this.method === options.method, 'Invalid HTTP method');
    }

    // Validating authentication
    Assert.exists(options.auth, 'No authentication specified');
    const authentication = options.auth as request.AuthOptions;
    Assert.exists(authentication.bearer, 'Should be a Bearer token');

    // Validating path
    if (this.path) {
      Assert.check(url.parse(uri).pathname === this.path, 'Invalid path');
    }

    // Validating query string
    if (this.queryString) {
      const query: string = url.parse(uri).query;
      if (query) {
        const parts: string[] = query.split('&');
        Assert.check(parts.sort().join('&') === this.queryString.sort().join('&'), 'Invalid query String');
      } else {
        Assert.check(this.queryString.length === 0, 'Query string should be empty');
      }
    }

    // Validating body
    if (this.body) {
      Assert.check(this.body === options.body ? options.body : '', 'Invalid body');
    }
  }

  // public getRequest(): request.Request {
  //   return request('http://perdu.com');
  // }
}
