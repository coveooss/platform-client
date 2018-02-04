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

export class InteractiveMode {
  static ORIGIN_ORG_ID: string = 'originOrganizationId';
  static ORIGIN_ORG_KEY: string = 'originOrganizationKey';
  static DESTINATION_ORG_ID: string = 'destinationOrganizationId';
  static DESTINATION_ORG_KEY: string = 'destinationOrganizationKey';
  static COMMAND: string = 'command';
  static GRADUATE_FIELDS_OPERATION: string = 'graduateFieldsOperation';
  static GRADUATE_SOURCES_OPERATION: string = 'graduateSourceOperation';
  static GRADUATE_EXTENSIONS_OPERATION: string = 'graduateExtensionsOperation';
  static CONTENT_TO_GRADUATE: string = 'contentToGraduate';
  static SOURCE_CONTENT_TO_GRADUATE: string = 'sourceContentToGraduate';
  static SETTING_FILENAME: string = 'settingFilename';
  static LOG_FILENAME: string = 'logFilename';
  static FORCE_GRADUATION: string = 'force';
  static LOG_LEVEL: string = 'logLevel';
  static KEY_TO_IGNORE: string = 'keyToIgnore';

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
      FieldAPI.getFieldModel()
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
      name: InteractiveMode.ORIGIN_ORG_ID,
      message: 'Origin Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getOriginOrganizationKey(): Question {
    return {
      type: 'input',
      name: InteractiveMode.ORIGIN_ORG_KEY,
      message: 'Origin Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getDestinationOrganizationId(): Question {
    return {
      type: 'input',
      name: InteractiveMode.DESTINATION_ORG_ID,
      message: 'Destination Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getDestinationOrganizationKey(): Question {
    return {
      type: 'input',
      name: InteractiveMode.DESTINATION_ORG_KEY,
      message: 'Destination Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getCommandList(): Question {
    return {
      type: 'list',
      name: InteractiveMode.COMMAND,
      message: 'Command to execute?',
      choices: [{ name: GraduateCommand.COMMAND_NAME }, { name: DiffCommand.COMMAND_NAME }]
    };
  }

  public setLogLevel(): Question {
    return {
      type: 'list',
      name: InteractiveMode.COMMAND,
      message: 'Log Level',
      default: 'info',
      choices: [{ name: 'insane' }, { name: 'verbose' }, { name: 'info' }, { name: 'error' }, { name: 'nothing' }]
    };
  }

  public getContentsToGraduate(): Question {
    return {
      type: 'checkbox',
      name: InteractiveMode.CONTENT_TO_GRADUATE,
      message: 'Graduate Fields?',
      choices: [{ name: FieldController.CONTROLLER_NAME }, { name: ExtensionController.CONTROLLER_NAME }],
      when: (answer: Answers) => answer[InteractiveMode.COMMAND].indexOf(GraduateCommand.COMMAND_NAME) !== -1,
      validate: this.checkboxValidator('You need to select at least 1 content to graduate.')
    };
  }

  public getGraduateOperationForFields(): Question {
    return this.getGraduateOperation(FieldController.CONTROLLER_NAME, InteractiveMode.GRADUATE_FIELDS_OPERATION);
  }

  public getGraduateOperationForExtensions(): Question {
    return this.getGraduateOperation(ExtensionController.CONTROLLER_NAME, InteractiveMode.GRADUATE_EXTENSIONS_OPERATION);
  }

  public setFieldsToIgnore(fieldModel: string[]): Question {
    return {
      type: 'checkbox',
      name: InteractiveMode.KEY_TO_IGNORE,
      message: `Select the keys that will no be taken in consideration for the diff`,
      choices: fieldModel,
      when: (answer: Answers) => fieldModel.length > 0
      // validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
    };
  }

  // public getSourceElementToGraduate(): Question {
  //   return {
  //     type: 'checkbox',
  //     name: InteractiveMode.SOURCE_CONTENT_TO_GRADUATE,
  //     message: 'What parts of the source you want to graduate?',
  //     choices: [
  //       { name: 'Configuration', value: 'configuration' },
  //       { name: 'Objects (Salesforce only)', value: 'objects' },
  //       { name: 'Mappings', value: 'mappings' },
  //       { name: 'Extensions', value: 'extensions' }
  //     ],
  //     when: (answer: Answers) => answer[InteractiveMode.SOURCE_CONTENT_TO_GRADUATE].indexOf(SourceController.CONTROLLER_NAME) !== -1,
  //     validate: this.checkboxValidator('You need to select at least 1 source content to graduate.')
  //   };
  // }

  public getFileNameForSettings(): Question {
    return this.getGenericFilename(InteractiveMode.SETTING_FILENAME, 'settings', 'Enter settings filename: ');
  }

  public getFileNameForLogs(): Question {
    return this.getGenericFilename(InteractiveMode.LOG_FILENAME, 'logs', 'Enter log filename: ');
  }

  public confirmGraduationAction(mes: string = 'Are you sure you want to perform this action?', variable: string): Question {
    return {
      type: 'confirm',
      name: variable,
      message: mes,
      default: false
    };
  }

  public forceGraduation(mes: string = 'Are you sure you want to perform a graduation?', variable: string): Question {
    return {
      type: 'confirm',
      name: variable,
      message: mes,
      default: false
    };
  }

  public getQuestions(data: any): Question[] {
    return [
      this.setFieldsToIgnore(data['fieldModel'] || [])
      //   this.getOriginOrganizationId(),
      //   this.getOriginOrganizationKey(),
      //   this.getDestinationOrganizationId(),
      //   this.getDestinationOrganizationKey(),
      //   this.getCommandList(),
      //   this.getContentsToGraduate(),
      //   this.getGraduateOperationForFields(),
      //   this.getGraduateOperationForExtensions(),
      //   // this.getSourceElementToGraduate(),
      //   // this.getGraduateOperationForSources(),
      //   this.setLogLevel(),
      //   this.getFileNameForSettings()
    ];
  }

  private getGraduateOperation(content: string, variable: string): Question {
    return {
      type: 'checkbox',
      name: variable,
      message: `Select the allowed operations on the destination organization for the ${content} graduation:`,
      choices: ['POST', 'PUT', 'DELETE'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: Answers) => {
        return (
          answer[InteractiveMode.COMMAND].indexOf(GraduateCommand.COMMAND_NAME) !== -1 &&
          answer[InteractiveMode.CONTENT_TO_GRADUATE].indexOf(content) !== -1
        );
      }
    };
  }

  private getGenericFilename(nameValue: string, defaultValue: string, messageValue: string): Question {
    return {
      type: 'input',
      name: nameValue,
      default: defaultValue,
      message: messageValue,
      filter: (fn: string) => {
        // TODO: let the user to add a absolute path
        return `${fn}.json`;
      }
    };
  }

  private inputValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyString(input) ? message : true);
  }
  private checkboxValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyArray(input) ? message : true);
  }
}
