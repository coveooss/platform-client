import { RequestResponse } from 'request';
import { Logger } from '../commons/logger';
import * as _ from 'underscore';
import * as chalk from 'chalk';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { IGenericError } from '../commons/errors';

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
    Logger.insane(`${JsonUtils.stringify(responses)} `);
  }

  protected graduateErrorHandler(error: IGenericError, errorMessage: string) {
    const tryToPrettyfy = (e: any) => {
      try {
        e = error.message.replace(/\\n/g, '');
        return JsonUtils.stringify(JSON.parse(e), 0);
      } catch (error) {
        return e;
      }
    };

    Logger.error(errorMessage, chalk.red('Organization ID: ' + error.orgId), error.message ? chalk.red(tryToPrettyfy(error.message)) : '');
  }
}
