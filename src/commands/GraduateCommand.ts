import * as inquirer from 'inquirer';
import * as _ from 'underscore';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { InteractiveQuestion } from '../console/InteractiveQuestion';
import { BaseController } from '../controllers/BaseController';
import { ExtensionController } from '../controllers/ExtensionController';
import { FieldController } from '../controllers/FieldController';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { Organization, IBlacklistObjects } from '../coveoObjects/Organization';
import { DiffCommand, IDiffOptions } from './DiffCommand';
import { SourceController } from '../controllers/SourceController';

export interface IHTTPGraduateOptions {
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
}

export interface IGraduateOptions extends IHTTPGraduateOptions {
  rebuild?: boolean;
  diffOptions: IDiffOptions;
  /**
   * Specify which key to strip before graduating the Object.
   */
  keysToStrip?: string[];
}

export class GraduateCommand {
  private organization1: Organization;
  private organization2: Organization;
  private InteractiveQuestion: InteractiveQuestion;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    blacklistObjects?: IBlacklistObjects
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey, blacklistObjects);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey, blacklistObjects);
    this.InteractiveQuestion = new InteractiveQuestion();
  }

  static DEFAULT_OPTIONS: IGraduateOptions = {
    diffOptions: DiffCommand.DEFAULT_OPTIONS,
    keysToStrip: [],
    rebuild: false,
    POST: true,
    PUT: true,
    DELETE: false
  };

  static COMMAND_NAME: string = 'graduate';

  graduateFields(options?: IGraduateOptions) {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    this.graduate(fieldController, 'Field', options);
  }

  graduateExtensions(options?: IGraduateOptions) {
    const extensionController: ExtensionController = new ExtensionController(this.organization1, this.organization2);
    this.graduate(extensionController, 'Extension', options);
  }

  graduateSources(options?: IGraduateOptions) {
    const sourceController: SourceController = new SourceController(this.organization1, this.organization2);
    this.graduate(sourceController, 'Source', options);
  }

  private graduate(controller: BaseController, objectName: string, opts?: IGraduateOptions) {
    const options = _.extend(GraduateCommand.DEFAULT_OPTIONS, opts) as IGraduateOptions;

    const questions: inquirer.Questions = [];
    const allowedMethods: string[] = _.compact([options.POST ? 'CREATE' : '', options.PUT ? 'UPDATE' : '', options.DELETE ? 'DELETE' : '']);

    let phrase = allowedMethods.length === 1 ? 'only ' : '';
    phrase += allowedMethods[0];
    for (let i = 1; i < allowedMethods.length; i++) {
      if (i === allowedMethods.length - 1) {
        phrase += ` and ${allowedMethods[i]}`;
      } else {
        phrase += `, ${allowedMethods[i]}`;
      }
    }

    questions.push(this.InteractiveQuestion.confirmGraduationAction(`Are you sure want to ${phrase} ${objectName}s?`, 'confirm'));
    // Make sure the user selects at least one HTTP method
    inquirer.prompt(questions).then((res: inquirer.Answers) => {
      if (res.confirm) {
        Logger.startSpinner(`Performing ${objectName} Graduation`);
        controller
          .diff(options.diffOptions)
          .then((diffResultArray: DiffResultArray<BaseCoveoObject>) => {
            controller
              .graduate(diffResultArray, options)
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
        Logger.info(`No ${objectName}s were graduated`);
        Logger.stopSpinner();
      }
    });
  }
}
