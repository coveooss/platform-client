import { RequestResponse } from 'request';
import { Logger } from '../commons/logger';
import * as _ from 'underscore';
import * as chalk from 'chalk';

export class BaseController {

  protected graduateSuccessHandler(responses: RequestResponse[], successMessage: string) {
    _.each(responses, (response: RequestResponse, idx: number) => {
      let info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        info.statusMessage = response.statusMessage;
      }

      Logger.info(`${successMessage}\n${chalk.green(JSON.stringify(info, undefined, 2))}`);
    });
    Logger.insane(`${JSON.stringify(responses)} `);
  }

  protected graduateErrorHandler(err: any, errorMessage: string) {
    let tryToPrettyfy = (e: any) => {
      try {
        return JSON.stringify(JSON.parse(e), undefined, 2);
      } catch (error) {
        return e;
      }
    };

    Logger.error(`${errorMessage}:\n${chalk.red(tryToPrettyfy(err))}`, err);
  }
}
