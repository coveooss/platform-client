import { Question } from 'inquirer';
import { Answers } from 'inquirer';
import { Utils } from '../commons/utils/Utils';
import * as inquirer from 'inquirer';
import { Logger } from '../commons/logger';

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
  filename: string;
};

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
  public FILENAME: string = 'filename';

  public start(): Promise<Answers> {
    const prompt = inquirer.createPromptModule();
    return prompt(this.getQuestions())
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
        { name: 'graduate', checked: true },
        { name: 'diff', disabled: 'Not implemented yet' }
      ]
    }
  }

  public getContentsToGraduate(): Question {
    return {
      type: 'checkbox',
      name: this.CONTENT_TO_GRADUATE,
      message: 'Graduate Fields?',
      choices: [
        { name: 'fields' },
        { name: 'extensions', disabled: 'Not implemented yet' },
        { name: 'sources' }
      ],
      when: (answer: IAnswer) => answer.command.indexOf('graduate') !== -1,
      validate: this.checkboxValidator('You need to select at least 1 content to graduate.')
    };
  }

  public getGraduateOperationForFields(): Question {
    return this.getGraduateOperation('fields', this.GRADUATE_FIELDS_OPERATION);
  }

  public getGraduateOperationForExtensions(): Question {
    return this.getGraduateOperation('extensions', this.GRADUATE_EXTENSIONS_OPERATION);
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
      when: (answer: IAnswer) => answer.contentToGraduate.indexOf('sources') !== -1,
      validate: this.checkboxValidator('You need to select at least 1 source content to graduate.')
    };
  }

  public getGraduateOperationForSources(): Question {
    return this.getGraduateOperation('sources', this.GRADUATE_SOURCES_OPERATION);
  }

  public getFileNameForSettings(): Question {
    return {
      type: 'input',
      name: this.FILENAME,
      default: 'settings',
      message: 'Enter fileName: ',
      filter: (fn: string) => {
        // TODO: let the user to add a absolute path
        return `${fn}.json`;
      }
    };
  }

  private getGraduateOperation(content: string, variable: string): Question {
    return {
      type: 'checkbox',
      name: variable,
      message: `Select the allowed operations on the destination organization for the ${content} graduation:`,
      choices: ['POST', 'PUT', 'DELETE'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: IAnswer) => {
        return answer.contentToGraduate.indexOf(content) !== -1
      }
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

  private inputValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string, answers?: Answers) => Utils.isEmptyString(input) ? message : true;
  }
  private checkboxValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string, answers?: Answers) => Utils.isEmptyArray(input) ? message : true;
  }

}
