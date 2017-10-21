import { Question } from 'inquirer';
import { Answers } from 'inquirer';
import { Utils } from '../commons/utils/Utils';

export interface IGraduateSettingOptions {
  create: boolean,
  update: boolean,
  delete: boolean
};

export interface ISourceContentSettingOptions {
  configuration: boolean,
  objects: boolean,
  mapping: boolean,
  extensions: boolean
};

export interface ISettings {
  organizations: {
    origin: {
      id: string,
      apiKey: string
    },
    destination: {
      id: string,
      apiKey: string
    }
  },
  graduate: {
    sources?: {
      options: IGraduateSettingOptions,
      content: ISourceContentSettingOptions
    },
    fields?: {
      options: IGraduateSettingOptions
    },
    extensions?: {
      options: IGraduateSettingOptions
    }
  }
};

export interface IAnswerVariables {
  ORIGIN_ORG_ID: string;
  ORIGIN_ORG_KEY: string;
  DESTINATION_ORG_ID: string;
  DESTINATION_ORG_KEY: string;
  COMMAND: string;
  GRADUATE_FIELDS_OPERATION: string;
  GRADUATE_SOURCES_OPERATION: string;
  GRADUATE_EXTENSIONS_OPERATION: string;
  CONTENT_TO_GRADUATE: string;
  SOURCE_CONTENT_TO_GRADUATE: string;
  FILENAME: string;
};

export class InquirerQuestions implements IAnswerVariables {

  public ORIGIN_ORG_ID: string = 'originOrganizationId';
  public ORIGIN_ORG_KEY: string = 'originOrganizationKey';
  public DESTINATION_ORG_ID: string = 'originOrganizationId';
  public DESTINATION_ORG_KEY: string = 'originOrganizationKey';
  public COMMAND: string = 'command';
  public GRADUATE_FIELDS_OPERATION: string = 'graduateFieldsOperation';
  public GRADUATE_SOURCES_OPERATION: string = 'graduateSourceOperation';
  public GRADUATE_EXTENSIONS_OPERATION: string = 'graduateExtensionsOperation';
  public CONTENT_TO_GRADUATE: string = 'objectsToGraduate';
  public SOURCE_CONTENT_TO_GRADUATE: string = 'objectsToGraduate';
  public FILENAME: string = 'filename';

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
      choices: ['graduate'] // TODO: add diff command here
    }
  }

  public getCONTENTsToGraduate(): Question {
    return {
      type: 'checkbox',
      name: this.CONTENT_TO_GRADUATE,
      message: 'Graduate Fields?',
      choices: ['fields', 'extensions', 'sources'],
      when: (answer: Answers) => answer[this.COMMAND].indexOf('graduate') !== -1,
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
      choices: ['Configuration', 'Objects (Salesforce only)', 'Mappings', 'Extensions'],
      when: (answer: Answers) => answer[this.CONTENT_TO_GRADUATE].indexOf('sources') !== -1,
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
      message: `Select the operations to apply to the ${content} graduation:`,
      choices: ['Create', 'Update', 'Delete'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: Answers) => answer[this.CONTENT_TO_GRADUATE].indexOf(content) !== -1,
    };
  }

  public getQuestions(): Question[] {
    return [
      this.getOriginOrganizationId(),
      this.getOriginOrganizationKey(),
      this.getDestinationOrganizationId(),
      this.getDestinationOrganizationKey(),
      this.getCommandList(),
      this.getCONTENTsToGraduate(),
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

  public genSettings(answers: IAnswerVariables) {
    let settings: ISettings = {
      organizations: {
        origin: {
          id: answers.ORIGIN_ORG_ID,
          apiKey: answers.ORIGIN_ORG_KEY
        },
        destination: {
          id: answers.DESTINATION_ORG_ID,
          apiKey: answers.DESTINATION_ORG_KEY
        }
      },
      graduate: {}
    };
    
    // answers
  }
}
