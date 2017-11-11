import * as inquirer from 'inquirer';
import { Question } from 'inquirer';
import { Answers } from 'inquirer';
import { Utils } from '../commons/utils/Utils';
import { GraduateCommand } from '../commands/GraduateCommand';
import { DiffCommand } from '../commands/DiffCommand';
import { FieldController } from '../controllers/FieldController';
import { ExtensionController } from '../controllers/ExtensionController';
import { SourceController } from '../controllers/SourceController';

export interface IAnswer {
  originOrganizationId: string;
  originOrganizationKey: string;
  destinationOrganizationId: string;
  destinationOrganizationKey: string;
  command: string;
  graduateFieldsOperation: string[];
  graduateSourceOperation: string[];
  graduateExtensionsOperation: string[];
  contentToGraduate: string[];
  sourceContentToGraduate: string[];
  settingFilename: string;
  logFilename: string;
  force: boolean;
}

export class InteractiveMode {

  public ORIGIN_ORG_ID: string = 'originOrganizationId';
  public ORIGIN_ORG_KEY: string = 'originOrganizationKey';
  public DESTINATION_ORG_ID: string = 'destinationOrganizationId';
  public DESTINATION_ORG_KEY: string = 'destinationOrganizationKey';
  public COMMAND: string = 'command';
  public GRADUATE_FIELDS_OPERATION: string = 'graduateFieldsOperation';
  public GRADUATE_SOURCES_OPERATION: string = 'graduateSourceOperation';
  public GRADUATE_EXTENSIONS_OPERATION: string = 'graduateExtensionsOperation';
  public CONTENT_TO_GRADUATE: string = 'contentToGraduate';
  public SOURCE_CONTENT_TO_GRADUATE: string = 'sourceContentToGraduate';
  public SETTING_FILENAME: string = 'settingFilename';
  public LOG_FILENAME: string = 'logFilename';
  public FORCE_GRADUATION: string = 'force';

  public start(): Promise<Answers> {
    const prompt = inquirer.createPromptModule();
    return prompt(this.getQuestions());
  }

  public getOriginOrganizationId(): Question {
    return {
      type: 'input',
      name: this.ORIGIN_ORG_ID,
      message: 'Origin Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getOriginOrganizationKey(): Question {
    return {
      type: 'input',
      name: this.ORIGIN_ORG_KEY,
      message: 'Origin Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getDestinationOrganizationId(): Question {
    return {
      type: 'input',
      name: this.DESTINATION_ORG_ID,
      message: 'Destination Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization')
    };
  }

  public getDestinationOrganizationKey(): Question {
    return {
      type: 'input',
      name: this.DESTINATION_ORG_KEY,
      message: 'Destination Organization API Key: ',
      validate: this.inputValidator('You need to provide the API Key of the Organization')
    };
  }

  public getCommandList(): Question {
    return {
      type: 'list',
      name: this.COMMAND,
      message: 'Command to execute?',
      choices: [
        { name: GraduateCommand.COMMAND_NAME, checked: true },
        { name: DiffCommand.COMMAND_NAME, disabled: 'Not implemented yet' }
      ]
    };
  }

  public getContentsToGraduate(): Question {
    return {
      type: 'checkbox',
      name: this.CONTENT_TO_GRADUATE,
      message: 'Graduate Fields?',
      choices: [
        { name: FieldController.CONTROLLER_NAME },
        { name: ExtensionController.CONTROLLER_NAME, disabled: 'Not implemented yet' },
        { name: SourceController.CONTROLLER_NAME }
      ],
      when: (answer: IAnswer) => answer.command.indexOf(GraduateCommand.COMMAND_NAME) !== -1,
      validate: this.checkboxValidator('You need to select at least 1 content to graduate.')
    };
  }

  public getGraduateOperationForFields(): Question {
    return this.getGraduateOperation(FieldController.CONTROLLER_NAME, this.GRADUATE_FIELDS_OPERATION);
  }

  public getGraduateOperationForExtensions(): Question {
    return this.getGraduateOperation(ExtensionController.CONTROLLER_NAME, this.GRADUATE_EXTENSIONS_OPERATION);
  }

  public getSourceElementToGraduate(): Question {
    return {
      type: 'checkbox',
      name: this.SOURCE_CONTENT_TO_GRADUATE,
      message: 'What parts of the source you want to graduate?',
      choices: [
        { name: 'Configuration', value: 'configuration' },
        { name: 'Objects (Salesforce only)', value: 'objects' },
        { name: 'Mappings', value: 'mappings' },
        { name: 'Extensions', value: 'extensions' }
      ],
      when: (answer: IAnswer) => answer.contentToGraduate.indexOf(SourceController.CONTROLLER_NAME) !== -1,
      validate: this.checkboxValidator('You need to select at least 1 source content to graduate.')
    };
  }

  public getGraduateOperationForSources(): Question {
    return this.getGraduateOperation(SourceController.CONTROLLER_NAME, this.GRADUATE_SOURCES_OPERATION);
  }

  public getFileNameForSettings(): Question {
    return this.getGenericFilename(this.SETTING_FILENAME, 'settings', 'Enter settings filename: ');
  }

  public getFileNameForLogs(): Question {
    return this.getGenericFilename(this.LOG_FILENAME, 'logs', 'Enter log filename: ');
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

  public getQuestions(): Question[] {
    return [
      this.getOriginOrganizationId(),
      this.getOriginOrganizationKey(),
      this.getDestinationOrganizationId(),
      this.getDestinationOrganizationKey(),
      this.getCommandList(),
      this.getContentsToGraduate(),
      this.getGraduateOperationForFields(),
      this.getGraduateOperationForExtensions(),
      this.getSourceElementToGraduate(),
      this.getGraduateOperationForSources(),
      this.getFileNameForSettings()
    ];
  }

  private getGraduateOperation(content: string, variable: string): Question {
    return {
      type: 'checkbox',
      name: variable,
      message: `Select the allowed operations on the destination organization for the ${content} graduation:`,
      choices: ['POST', 'PUT', 'DELETE'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: IAnswer) => {
        return answer.contentToGraduate.indexOf(content) !== -1;
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
    return (input: string, answers?: Answers) => Utils.isEmptyString(input) ? message : true;
  }
  private checkboxValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string, answers?: Answers) => Utils.isEmptyArray(input) ? message : true;
  }

}
