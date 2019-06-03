import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { IDiffOptions } from '../commands/DiffCommand';
import { IHTTPGraduateOptions } from '../commands/GraduateCommand';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError } from '../commons/errors';
import { Logger } from '../commons/logger';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';

export interface IDiffResultArrayClean {
  summary?: {
    TO_CREATE: number;
    TO_UPDATE: number;
    TO_DELETE: number;
  };
  TO_CREATE: any[];
  TO_UPDATE: any[];
  TO_DELETE: any[];
}

export interface IPrintOptions {
  includeSummary?: boolean;
}

/**
 * Every Controller ultimately inherits from this base controller class.
 */
export abstract class BaseController {
  abstract diff(diffOptions?: IDiffOptions): Promise<DiffResultArray<BaseCoveoObject>>;

  abstract graduate(diffResultArray: DiffResultArray<BaseCoveoObject>, options: IHTTPGraduateOptions): Promise<any[]>;

  abstract download(organization: string): Promise<IDownloadResultArray>;

  abstract extractionMethod(object: any[], diffOptions?: IDiffOptions, oldVersion?: any[]): any[];

  protected successHandler(response: RequestResponse[] | RequestResponse, successMessage: string) {
    const successLog = (rep: RequestResponse) => {
      const info: any = { statusCode: rep.statusCode };
      if (rep.statusMessage) {
        // Not able to test status message with nock
        // https://github.com/node-nock/nock/issues/469
        info.statusMessage = rep.statusMessage;
      }
      Logger.info(successMessage);
      Logger.verbose(`${Colors.success(JsonUtils.stringify(info))}`);
    };

    if (Array.isArray(response)) {
      _.each(response, (rep: RequestResponse) => {
        successLog(rep);
      });
    } else {
      successLog(response);
    }
    const stringifiedResponse = `${JsonUtils.stringify(response)} `;

    // Remove any API Keys from the logs
    Logger.insane(this.obfuscateAPIKeys(stringifiedResponse));
  }

  private obfuscateAPIKeys(str: string): string {
    const regex = /bearer\s[^"]*/gim;
    const subst = 'Bearer xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    return str.replace(regex, subst);
  }

  protected errorHandler(error: IGenericError, errorMessage: string) {
    Logger.error(
      `${error.orgId ? 'Error occurred for ' + Colors.organization(error.orgId) + ': ' : ''}${errorMessage}`,
      error.message ? Colors.error(error.message) : ''
    );
  }

  protected getAuthorizedOperations<T, R>(
    diffResultArray: DiffResultArray<T>,
    graduateNew: (diffResult: DiffResultArray<T>) => Promise<R>,
    graduateUpdated: (diffResult: DiffResultArray<T>) => Promise<R>,
    graduateDeleted: (diffResult: DiffResultArray<T>) => Promise<R>,
    options: IHTTPGraduateOptions
  ): Array<(diffResult: DiffResultArray<T>) => Promise<R>> {
    const authorizedOperations: Array<(diffResult: DiffResultArray<T>) => Promise<R>> = [];
    if (options.POST && diffResultArray.TO_CREATE.length > 0) {
      authorizedOperations.push(graduateNew);
    } else {
      Logger.verbose('Skipping POST operation');
    }
    if (options.PUT && diffResultArray.TO_UPDATE.length > 0) {
      authorizedOperations.push(graduateUpdated);
    } else {
      Logger.verbose('Skipping PUT operation');
    }
    if (options.DELETE && diffResultArray.TO_DELETE.length > 0) {
      authorizedOperations.push(graduateDeleted);
    } else {
      Logger.verbose('Skipping DELETE operation');
    }
    if (authorizedOperations.length === 0) {
      Logger.verbose('No HTTP mothod was selected for the graduation');
    }

    return authorizedOperations;
  }

  /**
   * Return a simplified diff object.
   * This function makes it easier to get a section of the diff result and use it in a API call.
   *
   * @template T
   * @param {DiffResultArray<T>} diffResultArray
   * @param {boolean} [summary=true]
   * @returns {IDiffResultArrayClean} The simplified object
   */
  getCleanVersion<T>(
    diffResultArray: DiffResultArray<T>,
    diffOptions: IDiffOptions = {},
    printOptions: IPrintOptions = {}
  ): IDiffResultArrayClean {
    printOptions = _.extend(printOptions, { includeSummary: true });

    const cleanerVersion: IDiffResultArrayClean = {
      summary: {
        TO_CREATE: 0,
        TO_UPDATE: 0,
        TO_DELETE: 0
      },
      TO_CREATE: [],
      TO_UPDATE: [],
      TO_DELETE: []
    };

    if (printOptions.includeSummary) {
      cleanerVersion.summary = {
        TO_CREATE: diffResultArray.TO_CREATE.length,
        TO_UPDATE: diffResultArray.TO_UPDATE.length,
        TO_DELETE: diffResultArray.TO_DELETE.length
      };
    }

    _.extend(cleanerVersion, {
      TO_CREATE: this.extractionMethod(diffResultArray.TO_CREATE, diffOptions),
      TO_UPDATE: this.extractionMethod(diffResultArray.TO_UPDATE, diffOptions, diffResultArray.TO_UPDATE_OLD),
      TO_DELETE: this.extractionMethod(diffResultArray.TO_DELETE, diffOptions)
    });

    return cleanerVersion as IDiffResultArrayClean;
  }
}
