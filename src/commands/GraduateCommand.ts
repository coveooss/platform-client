import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { BaseCommand } from './BaseCommand';
import { Organization } from '../models/OrganizationModel';
import { FieldController } from '../controllers/FieldController';
import { UrlService } from '../commons/services/UrlService';
import { IGraduateSettingOptions } from '../console/SettingsController';
import { InteractiveMode } from '../console/InteractiveMode';
import { Logger } from '../commons/logger';

export class GraduateCommand {
  private organization1: Organization;
  private organization2: Organization;
  private interactiveMode: InteractiveMode;
  private options: IGraduateSettingOptions;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    options?: IGraduateSettingOptions
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
    this.interactiveMode = new InteractiveMode();
    this.options = _.extend(GraduateCommand.DEFAULT_OPTIONS, options);
  }

  static DEFAULT_OPTIONS: IGraduateSettingOptions = {
    POST: true,
    PUT: true,
    DELETE: true,
    force: false
  };
  static COMMAND_NAME: string = 'graduate';

  public graduateFields() {
    let fieldController: FieldController = new FieldController();
    let questions: inquirer.Questions = [];
    if (!this.options.force) {
      questions.push(this.interactiveMode.confirmGraduationAction(`Are you sure want to perform a field graduation?`, 'confirm'));
    }
    inquirer.prompt(questions)
      .then((res: inquirer.Answers) => {
        if (res.confirm) {
          fieldController.graduate(this.organization1, this.organization2);
        } else {
          Logger.info('No fields were graduated');
        }
      });
  }

  public graduateSources() {

  }

  public graduateExtensions() {

  }

}
