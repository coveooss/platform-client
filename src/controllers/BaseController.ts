import * as _ from 'underscore';
import * as chalk from 'chalk';
import { RequestResponse } from 'request';
import { Logger } from '../commons/logger';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { IGenericError } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDiffOptions } from '../commands/DiffCommand';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { Colors } from '../commons/colors';

export interface IDiffResultArrayClean {
  summary: {
    TO_CREATE: number;
    TO_UPDATE: number;
    TO_DELETE: number;
  };
  TO_CREATE: any[];
  TO_UPDATE: any[];
  TO_DELETE: any[];
}

/**
 * Every Controller ultimately inherits from this base controller class.
 */
export abstract class BaseController {
  public abstract diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<BaseCoveoObject>>;

  protected successHandler(responses: RequestResponse[], successMessage: string) {
    _.each(responses, (response: RequestResponse) => {
      const info: any = { statusCode: response.statusCode };
      if (response.statusMessage) {
        // Not able to test status message with nock
        // https://github.com/node-nock/nock/issues/469
        info.statusMessage = response.statusMessage;
      }

      Logger.info(successMessage, `${Colors.success(JsonUtils.stringify(info))}`);
    });
    Logger.insane(`${JsonUtils.stringify(responses)} `);
  }

  protected errorHandler(error: IGenericError, errorMessage: string) {
    Logger.error(
      `Error occurred for ${Colors.organization(error.orgId)}: ${errorMessage}`,
      error.message ? Colors.error(error.message) : ''
    );
  }

  /**
   * Return a simplified diff object.
   * This function makes it easier to get a section of the diff result and use it in a API call.
   *
   * @template T
   * @param {DiffResultArray<T>} diffResultArray
   * @param {(object: T[]) => any[]} extractionMethod Method to extract the object model
   * @param {boolean} [summary=true]
   * @returns {IDiffResultArrayClean} The simplified object
   */
  public getCleanVersion<T>(
    diffResultArray: DiffResultArray<T>,
    extractionMethod: (object: T[]) => any[],
    summary: boolean = true
  ): IDiffResultArrayClean {
    const cleanVersion: IDiffResultArrayClean = {
      summary: {
        TO_CREATE: 0,
        TO_UPDATE: 0,
        TO_DELETE: 0
      },
      TO_CREATE: [],
      TO_UPDATE: [],
      TO_DELETE: []
    };

    if (summary) {
      cleanVersion.summary = {
        TO_CREATE: diffResultArray.TO_CREATE.length,
        TO_UPDATE: diffResultArray.TO_UPDATE.length,
        TO_DELETE: diffResultArray.TO_DELETE.length
      };
    }

    _.extend(cleanVersion, {
      TO_CREATE: extractionMethod(diffResultArray.TO_CREATE),
      TO_UPDATE: extractionMethod(diffResultArray.TO_UPDATE),
      TO_DELETE: extractionMethod(diffResultArray.TO_DELETE)
    });

    return cleanVersion as IDiffResultArrayClean;
  }
}
