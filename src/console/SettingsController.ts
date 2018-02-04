import { Answers } from 'inquirer';
import { InteractiveMode } from './InteractiveMode';

export interface ISourceContentSettingOptions {
  configuration: boolean;
  objects: boolean;
  mapping: boolean;
  extensions: boolean;
}

export class SettingsController {
  // static parseSettings(settings: ISettings) {

  // }

  static generateCommand(answers: Answers) {
    const command = [];

    // Required parameters
    command.push(answers[InteractiveMode.ORIGIN_ORG_ID]);
    command.push(answers[InteractiveMode.DESTINATION_ORG_ID]);
    command.push(answers[InteractiveMode.ORIGIN_ORG_KEY]);
    command.push(answers[InteractiveMode.DESTINATION_ORG_KEY]);
    command.push(answers[InteractiveMode.COMMAND]);

    // Global options
    // const options = {
    //   logLevel: answers[InteractiveMode.LOG_LEVEL],
    //   logOutput: answers[InteractiveMode.LOG_FILENAME],
    //   methods: answers[InteractiveMode.GRADUATE_FIELDS_OPERATION],
    // };

    return command;
  }
}
