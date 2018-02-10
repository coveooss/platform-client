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
  protected successHandler(responses: RequestResponse[], successMessage: string) {
    _.each(responses, (response: RequestResponse) => {
      const info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        // Not able to test status message with nock
        // https://github.com/node-nock/nock/issues/469
        info.statusMessage = response.statusMessage;
      }

      Logger.info(successMessage, `${chalk.green(JsonUtils.stringify(info))}`);
    });
    Logger.insane(`${JsonUtils.stringify(responses)} `);
  }

  protected errorHandler(error: IGenericError, errorMessage: string) {
    Logger.error(`Error occurred for ${chalk.bold(error.orgId)}: ${errorMessage}`, error.message ? chalk.red(error.message) : '');
  }
}
