import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { InteractiveQuestion } from '../console/InteractiveQuestion';
import { Logger } from '../commons/logger';
import { StaticErrorMessage, IGenericError } from '../commons/errors';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { Field } from '../coveoObjects/Field';
import { IDiffOptions, DiffCommand } from './DiffCommand';
import { BaseController } from '../controllers/BaseController';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { ExtensionController } from '../controllers/ExtensionController';

export interface IHTTPGraduateOptions {
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
}

export interface IGraduateOptions extends IHTTPGraduateOptions {
  force: boolean;
  diffOptions: IDiffOptions;
}

export class GraduateCommand {
  private organization1: Organization;
  private organization2: Organization;
  private InteractiveQuestion: InteractiveQuestion;

  constructor(originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
    this.InteractiveQuestion = new InteractiveQuestion();
  }

  static DEFAULT_OPTIONS: IGraduateOptions = {
    diffOptions: DiffCommand.DEFAULT_OPTIONS,
    force: false,
    POST: true,
    PUT: true,
    DELETE: true
  };

  static COMMAND_NAME: string = 'graduate';

  public graduateFields(options?: IGraduateOptions) {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    this.graduate(fieldController, 'Field', options);
  }

  public graduateExtensions(options?: IGraduateOptions) {
    const extensionController: ExtensionController = new ExtensionController(this.organization1, this.organization2);
    this.graduate(extensionController, 'Extension', options);
  }

  private graduate(controller: BaseController, objectName: string, opts?: IGraduateOptions) {
    const options = _.extend(GraduateCommand.DEFAULT_OPTIONS, opts) as IGraduateOptions;

    const questions: inquirer.Questions = [];
    const allowedMethods: string[] = _.compact([options.POST ? 'POST' : '', options.PUT ? 'PUT' : '', options.DELETE ? 'DELETE' : '']);

    if (!options.force) {
      questions.push(
        this.InteractiveQuestion.confirmGraduationAction(
          `Are you sure want to perform a ${objectName} graduation (${allowedMethods})?`,
          'confirm'
        )
      );
    }
    // Make sure the user selects at least one HTTP method
    inquirer.prompt(questions).then((res: inquirer.Answers) => {
      if (res.confirm || options.force) {
        // TODO: Ask the user if he wants to perform the graduation manually HERE!!!

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
          .catch((err: IGenericError) => {
            Logger.error('Error in graduation operation', err.message);
            Logger.stopSpinner();
          });
      } else {
        Logger.info(`No ${objectName}  were graduated`);
        Logger.stopSpinner();
      }
    });
  }

  public graduateSources() {}
}
