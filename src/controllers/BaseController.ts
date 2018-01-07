import { RequestResponse } from 'request';
import { Logger } from '../commons/logger';
import * as _ from 'underscore';
import * as chalk from 'chalk';
import { JsonUtils } from '../commons/utils/JsonUtils';

/**
 * Every Controller ultimately inherits from this base controller class.
 */
export class BaseController {
  protected graduateSuccessHandler(responses: RequestResponse[], successMessage: string) {
    _.each(responses, (response: RequestResponse) => {
      const info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        info.statusMessage = response.statusMessage;
      }

      Logger.info(successMessage, `${chalk.green(JsonUtils.stringify(info))}`);
    });
    Logger.insane(`${JSON.stringify(responses)} `);
  }

  protected graduateErrorHandler(err: any, errorMessage: string) {
    const tryToPrettyfy = (e: any) => {
      try {
        e = err.replace(/\\n/g, '');
        return JsonUtils.stringify(JSON.parse(e));
      } catch (error) {
        return e;
      }
    };

    Logger.error(errorMessage, err ? `${chalk.red(tryToPrettyfy(err))}` : '');
  }
}
