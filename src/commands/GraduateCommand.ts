import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { UrlService } from '../commons/rest/UrlService';
import { InteractiveMode } from '../console/InteractiveMode';
import { Logger } from '../commons/logger';
import { StaticErrorMessage } from '../commons/errors';

export interface IGraduateOptions {
  force: boolean;
}

export class GraduateCommand {
  private organization1: Organization;
  private organization2: Organization;
  private interactiveMode: InteractiveMode;
  private options: IGraduateOptions;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    options?: IGraduateOptions
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
    this.interactiveMode = new InteractiveMode();
    this.options = _.extend(GraduateCommand.DEFAULT_OPTIONS, options);
  }

  static DEFAULT_OPTIONS: IGraduateOptions = {
    force: false
  };

  static COMMAND_NAME: string = 'graduate';

  public graduateFields() {
    let fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    let questions: inquirer.Questions = [];
    if (!this.options.force) {
      questions.push(this.interactiveMode.confirmGraduationAction(`Are you sure want to perform a field graduation?`, 'confirm'));
    }
    inquirer.prompt(questions)
      .then((res: inquirer.Answers) => {
        if (res.confirm || this.options.force) {
          Logger.startSpinner('Performing Field Graduation');
          fieldController.graduate()
            .then(() => {
              Logger.info('Graduation operation completed');
              Logger.stopSpinner();
            }).catch((err: any) => {
              Logger.error(StaticErrorMessage.UNABLE_TO_GRADUATE, err);
              Logger.stopSpinner();
            });
        } else {
          Logger.info('No fields were graduated');
          Logger.stopSpinner();
        }
      });
  }

  public graduateSources() {

  }

  public graduateExtensions() {

  }

}
