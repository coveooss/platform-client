import { RequestResponse } from 'request';
import { Logger } from '../commons/logger';
import * as _ from 'underscore';
import * as chalk from 'chalk';

/**
 * Every Controller ultimately inherits from this base controller class.
 */
export class BaseController {

  protected graduateSuccessHandler(responses: RequestResponse[], successMessage: string) {
    _.each(responses, (response: RequestResponse, idx: number) => {
      let info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        info.statusMessage = response.statusMessage;
      }

      Logger.info(successMessage, `${chalk.green(JSON.stringify(info, undefined, 2))}`);
    });
    Logger.insane(`${JSON.stringify(responses)} `);
  }

  protected graduateErrorHandler(err: any, errorMessage: string) {
    let tryToPrettyfy = (e: any) => {
      try {
        e = err.replace(/\\n/g, '');
        return JSON.stringify(JSON.parse(e), undefined, 2);
      } catch (error) {
        return e;
      }
    };

    Logger.error(errorMessage, err ? `${chalk.red(tryToPrettyfy(err))}` : '');
  }

  public clone<T>() {
  }
}
