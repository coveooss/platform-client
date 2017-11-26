import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { UrlService } from '../commons/rest/UrlService';
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
    let fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    let questions: inquirer.Questions = [];
    if (!this.options.force) {
      // TODO: do not ask the question if this.options.POST, PUT, DELETe are false
      // TODO: tailor the question for the user
      questions.push(this.interactiveMode.confirmGraduationAction(`Are you sure want to perform a field graduation?`, 'confirm'));
    }
    inquirer.prompt(questions)
      .then((res: inquirer.Answers) => {
        if (res.confirm || this.options.force) {
          Logger.startSpinner('Graduating fields');
          fieldController.graduate()
            .then(() => {
              Logger.info('Graduation Completed!');
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
