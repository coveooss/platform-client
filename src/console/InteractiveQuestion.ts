import * as _ from 'underscore';
import * as inquirer from 'inquirer';
import { RequestResponse } from 'request';
import { Question } from 'inquirer';
import { Answers } from 'inquirer';
import { Utils } from '../commons/utils/Utils';
import { GraduateCommand } from '../commands/GraduateCommand';
import { DiffCommand } from '../commands/DiffCommand';
import { FieldController } from '../controllers/FieldController';
import { ExtensionController } from '../controllers/ExtensionController';
import { FieldAPI } from '../commons/rest/FieldAPI';

export class InteractiveQuestion {
  // Required parameters
  static ORIGIN_ORG_ID: string = 'originOrganizationId';
  static ORIGIN_ORG_KEY: string = 'originOrganizationKey';
  static DESTINATION_ORG_ID: string = 'destinationOrganizationId';
  static DESTINATION_ORG_KEY: string = 'destinationOrganizationKey';
  static COMMAND: string = 'command';

  // Options
  static GRADUATE_OPERATIONS: string = 'graduateOperations';
  static OBJECT_TO_MANIPULATE: string = 'objecttToManipulate';
  static SETTING_FILENAME: string = 'settingFilename';
  static LOG_FILENAME: string = 'logFilename';
  static FORCE_GRADUATION: string = 'force';
  static LOG_LEVEL: string = 'logLevel';
  static KEY_TO_IGNORE: string = 'keyToIgnore';
  static KEY_TO_INCLUDE_ONLY: string = 'keyToIncludeOnly';
  static ADVANCED_MODE: string = 'advancedMode';
  static BASIC_CONFIGURATION_MODE: string = 'Basic';
  static ADVANCED_CONFIGURATION_MODE: string = 'Advanced';
  // static EXECUTE_COMMAND: string = 'executeCommand';

  public start(): Promise<Answers> {
    const prompt = inquirer.createPromptModule();
    return this.loadFieldModel()
      .then((model: {}) => {
        return prompt(this.getQuestions({ fieldModel: model }));
      })
      .catch((err: any) => {
        console.error('Unable to load Field model.');
        return prompt(this.getQuestions({}));
      });
  }

  public loadFieldModel() {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      FieldAPI.getFieldDefinitions()
        .then((resp: RequestResponse) => {
          if (resp.body.definitions && resp.body.definitions.FieldModel && resp.body.definitions.FieldModel.properties) {
            resolve(_.keys(resp.body.definitions.FieldModel.properties));
          } else {
            reject('Unexpected response when trying to load field model');
          }
        })
        .catch((err: any) => {
          reject('Unable to fetch field model');
        });
    });
  }

  public getOriginOrganizationId(): Question {
    return {
      type: 'input',
      name: InteractiveQuestion.ORIGIN_ORG_ID,
      message: 'Origin Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getOriginOrganizationKey(): Question {
    return {
      type: 'input',
      name: InteractiveQuestion.ORIGIN_ORG_KEY,
      message: 'Origin Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getDestinationOrganizationId(): Question {
    return {
      type: 'input',
      name: InteractiveQuestion.DESTINATION_ORG_ID,
      message: 'Destination Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getDestinationOrganizationKey(): Question {
    return {
      type: 'input',
      name: InteractiveQuestion.DESTINATION_ORG_KEY,
      message: 'Destination Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getCommandList(): Question {
    return {
      type: 'list',
      name: InteractiveQuestion.COMMAND,
      message: 'Command to execute?',
      choices: [{ name: DiffCommand.COMMAND_NAME }, { name: GraduateCommand.COMMAND_NAME }]
    };
  }

  public setLogLevel(): Question {
    return {
      type: 'list',
      name: InteractiveQuestion.LOG_LEVEL,
      message: 'Log Level',
      default: 'info',
      choices: [{ name: 'nothing' }, { name: 'error' }, { name: 'info' }, { name: 'verbose' }, { name: 'insane' }],
      when: (answer: Answers) => answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE
    };
  }

  public getContentToDiff(): Question {
    return {
      type: 'list',
      name: InteractiveQuestion.OBJECT_TO_MANIPULATE,
      message: 'What would you like to diff?',
      choices: [{ name: FieldController.CONTROLLER_NAME }, { name: ExtensionController.CONTROLLER_NAME }],
      when: (answer: Answers) => answer[InteractiveQuestion.COMMAND].indexOf(DiffCommand.COMMAND_NAME) !== -1
    };
  }

  public getContentToGraduate(): Question {
    return {
      type: 'list',
      name: InteractiveQuestion.OBJECT_TO_MANIPULATE,
      message: 'What would you like to graduate?',
      choices: [{ name: FieldController.CONTROLLER_NAME }, { name: ExtensionController.CONTROLLER_NAME }],
      when: (answer: Answers) => answer[InteractiveQuestion.COMMAND] === GraduateCommand.COMMAND_NAME
    };
  }

  public setAdvancedConfiguration(): Question {
    return {
      type: 'list',
      name: InteractiveQuestion.ADVANCED_MODE,
      message: 'Options Configuration',
      default: InteractiveQuestion.BASIC_CONFIGURATION_MODE,
      choices: [{ name: InteractiveQuestion.BASIC_CONFIGURATION_MODE }, { name: InteractiveQuestion.ADVANCED_CONFIGURATION_MODE }]
    };
  }

  public setKeysToIgnore(fieldModel: string[]): Question {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.KEY_TO_IGNORE,
      message: `Select the keys that will no be taken in consideration during the diff`,
      choices: fieldModel,
      when: (answer: Answers) =>
        answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE &&
        answer[InteractiveQuestion.COMMAND] === FieldController.CONTROLLER_NAME &&
        fieldModel.length > 0
    };
  }

  public setKeysToIncludeOnly(fieldModel: string[]): Question {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.KEY_TO_INCLUDE_ONLY,
      message: `Select the keys that you only want to perform the diff`,
      choices: fieldModel,
      when: (answer: Answers) =>
        answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE && fieldModel.length > 0
    };
  }

  public getFileNameForSettings(): Question {
    return this.getGenericFilename(
      InteractiveQuestion.SETTING_FILENAME,
      'command.sh',
      'Enter the filename where the command will be saved: ',
      true
    );
  }

  public getFileNameForLogs(): Question {
    return this.getGenericFilename(InteractiveQuestion.LOG_FILENAME, 'logs.txt', 'Enter the filename to output logs: ');
  }

  public confirmGraduationAction(mes: string = 'Are you sure you want to perform this action?', variable: string): Question {
    return {
      type: 'confirm',
      name: variable,
      message: mes,
      default: false
    };
  }

  public forceGraduation(): Question {
    return {
      type: 'confirm',
      name: InteractiveQuestion.FORCE_GRADUATION,
      message: 'Force graduation without confirmation prompt',
      default: false,
      when: (answer: Answers) =>
        answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE &&
        answer[InteractiveQuestion.COMMAND] === GraduateCommand.COMMAND_NAME
    };
  }

  // public executeCommand(): Question {
  //   return {
  //     type: 'confirm',
  //     name: InteractiveQuestion.EXECUTE_COMMAND,
  //     message: 'Would you like to execute the configured command?',
  //     default: false
  //   };
  // }

  public getQuestions(data: any): Question[] {
    return [
      this.getOriginOrganizationId(),
      this.getDestinationOrganizationId(),
      this.getOriginOrganizationKey(),
      this.getDestinationOrganizationKey(),
      this.getCommandList(),

      // If Graduation
      this.getContentToDiff(),
      this.getContentToGraduate(),
      this.getGraduateOperation(),

      // Common Options
      this.setAdvancedConfiguration(),
      this.setKeysToIgnore(data['fieldModel'] || []), // only execute when in advanced option
      this.setKeysToIncludeOnly(data['fieldModel'] || []), // only execute when in advanced option
      this.setLogLevel(),
      this.forceGraduation(),
      this.getFileNameForLogs(),
      this.getFileNameForSettings()
      // this.executeCommand()
    ];
  }

  private getGraduateOperation(): Question {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.GRADUATE_OPERATIONS,
      message: `Select the allowed operations on the destination organization for the graduation:`,
      choices: ['POST', 'PUT', 'DELETE'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: Answers) => answer[InteractiveQuestion.COMMAND] === GraduateCommand.COMMAND_NAME
    };
  }

  private getGenericFilename(nameValue: string, defaultValue: string, messageValue: string, alwaysRun: boolean = false): Question {
    return {
      type: 'input',
      name: nameValue,
      default: defaultValue,
      message: messageValue,
      when: (answer: Answers) => alwaysRun || answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE
    };
  }

  private inputValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyString(input) ? message : true);
  }
  private checkboxValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyArray(input) ? message : true);
  }
}
