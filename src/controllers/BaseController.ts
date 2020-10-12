import * as opn from 'open';
import * as inquirer from 'inquirer';
import { compact, each, extend } from 'underscore';
import { ensureDirSync, writeJSON, writeFile } from 'fs-extra';
import { render } from 'ejs';
import { RequestResponse } from 'request';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { IHTTPGraduateOptions, IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { InteractiveQuestion } from '../console/InteractiveQuestion';
import { join } from 'path';
import { DiffTemplate } from '../ui/DiffTemplate';

export interface IDownloadOptions {
  outputFolder: string;
}
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
  static DEFAULT_DIFF_OPTIONS: IDiffOptions = {
    keysToIgnore: [],
    includeOnly: [],
    silent: false,
  };

  static DEFAULT_GRADUATE_OPTIONS: IGraduateOptions = {
    diffOptions: BaseController.DEFAULT_DIFF_OPTIONS,
    keyWhitelist: [],
    keyBlacklist: [],
    rebuild: false,
    POST: true,
    PUT: true,
    DELETE: false,
  };

  private InteractiveQuestion: InteractiveQuestion;

  constructor() {
    this.InteractiveQuestion = new InteractiveQuestion();
  }

  abstract objectName: string;

  abstract runDiffSequence(diffOptions?: IDiffOptions): Promise<DiffResultArray<BaseCoveoObject>>;

  abstract runGraduateSequence(diffResultArray: DiffResultArray<BaseCoveoObject>, options: IHTTPGraduateOptions): Promise<any[]>;

  abstract runDownloadSequence(): Promise<DownloadResultArray>;

  abstract extractionMethod(object: any[], diffOptions?: IDiffOptions, oldVersion?: any[]): any[];

  download(options: IDownloadOptions) {
    Logger.startSpinner(`Downloading ${this.objectName}`);
    this.runDownloadSequence()
      .then((downloadResultArray: DownloadResultArray) => {
        // sort the items in the list
        downloadResultArray.sort();

        // get the list
        const items = downloadResultArray.getItems().map((item) => item.getConfiguration());

        // ensure path
        ensureDirSync(options.outputFolder);
        // prepare file name
        const filename = join(options.outputFolder, `${this.objectName.toLowerCase()}.json`);
        // save to file
        writeJSON(filename, items, { spaces: 2 })
          .then(() => {
            Logger.info('Download operation completed');
            Logger.info(`File saved as ${Colors.filename(filename)}`);
            Logger.stopSpinner();
            process.exit();
          })
          .catch((err: any) => {
            Logger.error('Unable to save download file', err);
            Logger.stopSpinner();
            process.exit();
          });
      })
      .catch((err: IGenericError) => {
        // TODO: review this error message
        Logger.error(StaticErrorMessage.UNABLE_TO_DOWNLOAD, err);
        Logger.stopSpinner();
        process.exit();
      });
  }

  graduate(opts?: IGraduateOptions) {
    const options = extend(BaseController.DEFAULT_GRADUATE_OPTIONS, opts) as IGraduateOptions;

    const questions = [];
    const allowedMethods: string[] = compact([options.POST ? 'CREATE' : '', options.PUT ? 'UPDATE' : '', options.DELETE ? 'DELETE' : '']);

    let phrase = allowedMethods.length === 1 ? 'only ' : '';
    phrase += allowedMethods[0];
    for (let i = 1; i < allowedMethods.length; i++) {
      if (i === allowedMethods.length - 1) {
        phrase += ` and ${allowedMethods[i]}`;
      } else {
        phrase += `, ${allowedMethods[i]}`;
      }
    }

    questions.push(this.InteractiveQuestion.confirmAction(`Are you sure want to ${phrase} ${this.objectName}?`, 'confirm'));
    // Make sure the user selects at least one HTTP method
    inquirer.prompt(questions).then((res: inquirer.Answers) => {
      if (res.confirm) {
        Logger.startSpinner(`Performing ${this.objectName} Graduation`);

        this.runDiffSequence(options.diffOptions)
          .then((diffResultArray: DiffResultArray<BaseCoveoObject>) => {
            this.runGraduateSequence(diffResultArray, options)
              .then(() => {
                Logger.info('Graduation operation completed');
                Logger.stopSpinner();
              })
              .catch((err: any) => {
                Logger.error(StaticErrorMessage.UNABLE_TO_GRADUATE, err);
                Logger.stopSpinner();
              });
          })
          .catch((err: any) => {
            Logger.logOnly(StaticErrorMessage.UNABLE_TO_GRADUATE, err);
            Logger.error(StaticErrorMessage.UNABLE_TO_GRADUATE, 'Consult the logs for more information');
            Logger.stopSpinner();
          });
      } else {
        Logger.info(`No ${this.objectName} were graduated`);
        Logger.stopSpinner();
      }
    });
  }

  diff(opt?: IDiffOptions) {
    const options = extend(BaseController.DEFAULT_DIFF_OPTIONS, opt) as IDiffOptions;

    Logger.startSpinner('Diff in progress...');

    // Give some useful information
    options.includeOnly && options.includeOnly.length > 0
      ? Logger.verbose(`Diff will be applied exclusively to the following keys: ${JSON.stringify(options.includeOnly)}`)
      : options.keysToIgnore
      ? Logger.verbose(`Diff will not be applied to the following keys: ${JSON.stringify(options.keysToIgnore)}`)
      : void 0;

    this.runDiffSequence(options)
      .then((diffResultArray: DiffResultArray<BaseCoveoObject>) => {
        Logger.info(`objectName: ${this.objectName}`);
        if (this.objectName === 'sources' || this.objectName === 'pages') {
          Logger.info('Preparing HTML diff file');

          const cleanVersion = this.getCleanDiffVersion(diffResultArray, options);

          // TODO: find a better way to load the template
          // It did not work with ejs.renderFile since it was loading the ejs file from the location the script was executed
          // Even after enabling __dirname with webpack, I was not able to load the diff-source.ejs file correctly
          const template = DiffTemplate.diffSource;
          const data = render(template, {
            DIFF_OBJECT: JSON.stringify(cleanVersion.TO_UPDATE),
            SOURCES_TO_CREATE: JSON.stringify(cleanVersion.TO_CREATE),
            SOURCES_TO_DELETE: JSON.stringify(cleanVersion.TO_DELETE),
            resourceType: this.objectName,
          });

          writeFile(`${this.objectName}Diff.html`, data)
            .then(() => {
              Logger.info('Diff operation completed');
              Logger.info(`File saved as ${Colors.filename(this.objectName + 'Diff.html')}`);
              Logger.stopSpinner();
              if (!options.silent) {
                opn(`${this.objectName}Diff.html`);
              }
              process.exit();
            })
            .catch((error: any) => {
              Logger.error('Unable to create html file', error);
              Logger.stopSpinner();
              process.exit();
            });
        } else {
          writeJSON(`${this.objectName}Diff.json`, this.getCleanDiffVersion(diffResultArray, options), { spaces: 2 })
            .then(() => {
              // TODO: do the same for every object types
              Logger.info('Diff operation completed');
              Logger.info(`File saved as ${Colors.filename(this.objectName + 'Diff.json')}`);
              Logger.stopSpinner();
              if (!options.silent) {
                opn(`${this.objectName}Diff.json`);
              }
              process.exit();
            })
            .catch((err: any) => {
              Logger.error('Unable to save setting file', err);
              Logger.stopSpinner();
              process.exit();
            });
        }
      })
      .catch((err: any) => {
        // FIXME: logonly does not seem to log
        Logger.logOnly(StaticErrorMessage.UNABLE_TO_DIFF, err);
        Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, 'Consult the logs for more information');
        Logger.stopSpinner();
        process.exit();
      });
  }

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
      each(response, (rep: RequestResponse) => {
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

  protected stopProcess(message: string, err?: any) {
    Logger.error(message, err);
    Logger.stopSpinner();
    process.exit();
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
  getCleanDiffVersion<T>(
    diffResultArray: DiffResultArray<T>,
    diffOptions: IDiffOptions = {},
    printOptions: IPrintOptions = {}
  ): IDiffResultArrayClean {
    printOptions = extend(printOptions, { includeSummary: true });

    const cleanerVersion: IDiffResultArrayClean = {
      summary: {
        TO_CREATE: 0,
        TO_UPDATE: 0,
        TO_DELETE: 0,
      },
      TO_CREATE: [],
      TO_UPDATE: [],
      TO_DELETE: [],
    };

    if (printOptions.includeSummary) {
      cleanerVersion.summary = {
        TO_CREATE: diffResultArray.TO_CREATE.length,
        TO_UPDATE: diffResultArray.TO_UPDATE.length,
        TO_DELETE: diffResultArray.TO_DELETE.length,
      };
    }

    extend(cleanerVersion, {
      TO_CREATE: this.extractionMethod(diffResultArray.TO_CREATE, diffOptions),
      TO_UPDATE: this.extractionMethod(diffResultArray.TO_UPDATE, diffOptions, diffResultArray.TO_UPDATE_OLD),
      TO_DELETE: this.extractionMethod(diffResultArray.TO_DELETE, diffOptions),
    });

    return cleanerVersion as IDiffResultArrayClean;
  }
}
