import { RequestResponse } from 'request';
import { DistinctQuestion, QuestionCollection, createPromptModule, Answers, ListChoiceOptions } from 'inquirer';
import { bold, underline, red, bgRed } from 'chalk';
import { extend, keys, pluck, union } from 'underscore';
import { FieldAPI } from '../commons/rest/FieldAPI';
import { Utils } from '../commons/utils/Utils';
import { SourceAPI } from '../commons/rest/SourceAPI';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionAPI } from '../commons/rest/ExtensionAPI';
import { StringUtil } from '../commons/utils/StringUtils';
import { PageAPI } from '../commons/rest/PageAPI';
import { showLoginPopup } from '../ui/login';

export class InteractiveQuestion {
  static FIELDS_CONTROLLER_NAME: string = 'fields';
  static EXTENSIONS_CONTROLLER_NAME: string = 'extensions';
  static SOURCES_CONTROLLER_NAME: string = 'sources';
  static PAGES_CONTROLLER_NAME: string = 'pages';
  // Required parameters
  static ORIGIN_ORG_ID: string = 'originOrganizationId';
  static USE_MASTER_API_KEY: string = 'APIKeyStrategy';
  static MASTER_API_KEY: string = 'masterAPIKey';
  static ORIGIN_API_KEY: string = 'originAPIKey';
  static DESTINATION_API_KEY: string = 'destinationAPIKey';
  static DESTINATION_ORG_ID: string = 'destinationOrganizationId';
  static COMMAND: string = 'command';
  static ORIGIN_ENVIRONMENT: string = 'originEnvironment';
  static DESTINATION_ENVIRONMENT: string = 'destinationEnvironment';

  // Options
  static GRADUATE_OPERATIONS: string = 'graduateOperations';
  static OBJECT_TO_MANIPULATE: string = 'objecttToManipulate';
  static DOWNLOAD_OUTPUT: string = 'downloadOutput';
  static SETTING_FILENAME: string = 'settingFilename';
  static LOG_FILENAME: string = 'logFilename';
  static SOURCES: string = 'sources';
  static SOURCES_TO_IGNORE: string = 'sourcesToIgnore';
  static SOURCES_TO_REBUILD: string = 'sourcesToRebuild';
  static IGNORE_EXTENSIONS: string = 'ignoreExtensions';
  static LOG_LEVEL: string = 'logLevel';
  static KEY_TO_IGNORE: string = 'keyToIgnore';
  static KEY_TO_INCLUDE_ONLY: string = 'keyToIncludeOnly';
  static ADVANCED_MODE: string = 'advancedMode';
  static BASIC_CONFIGURATION_MODE: string = 'Basic';
  static ADVANCED_CONFIGURATION_MODE: string = 'Advanced';
  static SOURCE_STRATEGY: string = 'sourceStrategy';
  // static EXECUTE_COMMAND: string = 'executeCommand';

  static GRADUATE_COMMAND: string = 'graduate';
  static REBUILD_COMMAND: string = 'rebuild-sources';
  static DIFF_COMMAND: string = 'diff';
  static DOWNLOAD_COMMAND: string = 'download';
  static UPLOAD_COMMAND: string = 'upload';

  // To answers from previous prompts
  static PREVIOUS_ANSWERS: Answers = {};

  async start() {
    const prompt = createPromptModule();
    return this.loadFieldModel()
      .then((model: string[]) => {
        return prompt(this.getInitialQuestions({ fieldModel: model })).then(async (ans: Answers) => {
          InteractiveQuestion.PREVIOUS_ANSWERS = ans;

          if (ans[InteractiveQuestion.USE_MASTER_API_KEY] === true) {
            ans[InteractiveQuestion.MASTER_API_KEY] = await showLoginPopup(ans[InteractiveQuestion.ORIGIN_ENVIRONMENT]);
          }

          const org = new Organization(
            ans[InteractiveQuestion.ORIGIN_ORG_ID],
            ans[InteractiveQuestion.USE_MASTER_API_KEY] ? ans[InteractiveQuestion.MASTER_API_KEY] : ans[InteractiveQuestion.ORIGIN_API_KEY],
            {
              platformUrl: ans[InteractiveQuestion.ORIGIN_ENVIRONMENT],
            }
          );

          return Promise.all([this.loadSourceList(org), this.loadExtensionList(org), this.loadPageList(org)])
            .then((values) => {
              const sources = values[0];
              const extensions = values[1];
              // tslint:disable-next-line: no-magic-numbers
              const pages = values[2];
              return prompt(this.getFinalQuestions({ sources: sources, extensionsToIgnore: extensions, pagesToIgnore: pages }));
            })
            .catch((err: any) => {
              console.error(red('Unable to load sources or extensions.'), red(err));
              return prompt(this.getFinalQuestions([]));
            });
        });
      })
      .catch((err: any) => {
        console.error('Unable to load Field model.', red(err));
        return prompt(this.getInitialQuestions({})).then((ans: Answers) => {
          InteractiveQuestion.PREVIOUS_ANSWERS = ans;
          return prompt(this.getFinalQuestions());
        });
      });
  }

  loadFieldModel(): Promise<string[]> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      FieldAPI.getFieldDefinitions()
        .then((resp: RequestResponse) => {
          if (resp.body.definitions && resp.body.definitions.FieldModel && resp.body.definitions.FieldModel.properties) {
            resolve(keys(resp.body.definitions.FieldModel.properties));
          } else {
            reject('Unexpected response when trying to load field model');
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  loadExtensionList(org: Organization) {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      ExtensionAPI.getAllExtensions(org)
        .then((resp: RequestResponse) => {
          resolve(pluck(resp.body, 'name'));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  loadPageList(org: Organization) {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      PageAPI.getAllPages(org)
        .then((resp: RequestResponse) => {
          resolve(pluck(resp.body, 'name'));
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  loadSourceList(org: Organization) {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      SourceAPI.getAllSources(org)
        .then((resp: RequestResponse) => {
          if (resp.body.length > 0) {
            resolve(pluck(resp.body, 'name'));
          } else {
            reject('No source available in this organization');
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  getOriginOrganizationId(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.ORIGIN_ORG_ID,
      message: 'Origin Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization'),
    };
  }

  getDestinationOrganizationId(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.DESTINATION_ORG_ID,
      message: 'Destination Organization ID: ',
      validate: this.inputValidator('You need to provide the ID of the Organization'),
      when: (answer: Answers) => {
        return [InteractiveQuestion.GRADUATE_COMMAND, InteractiveQuestion.DIFF_COMMAND].indexOf(answer[InteractiveQuestion.COMMAND]) !== -1;
      },
    };
  }

  getApiKeyStrategy(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.USE_MASTER_API_KEY,
      message: 'Authentication strategy',
      default: true,
      choices: [
        { name: 'Web login (one master API key)', value: true },
        { name: '2 API keys (one per organization)', value: false },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        answer[InteractiveQuestion.USE_MASTER_API_KEY] = true;
        return (
          answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.REBUILD_COMMAND ||
          answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.DIFF_COMMAND
        );
      },
    };
  }

  getMasterApiKey(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.MASTER_API_KEY,
      message: 'Master API Key: ',
      validate: this.inputValidator('You need to provide an API Key'),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.USE_MASTER_API_KEY] === true;
      },
    };
  }

  getOriginApiKey(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.ORIGIN_API_KEY,
      message: 'Origin Organization API Key: ',
      validate: this.inputValidator('You need to provide an API Key'),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.USE_MASTER_API_KEY] === false;
      },
    };
  }

  getDestinationApiKey(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.DESTINATION_API_KEY,
      message: 'Destination Organization API Key: ',
      validate: this.inputValidator('You need to provide an API Key'),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.USE_MASTER_API_KEY] === false;
      },
    };
  }

  getPlatformOriginEnvironment(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.ORIGIN_ENVIRONMENT,
      message: 'Origin Organization environment',
      default: 'https://platform.cloud.coveo.com',
      choices: [
        { name: 'Production (US)', value: 'https://platform.cloud.coveo.com' },
        { name: 'Production (Europe)', value: 'https://platform-eu.cloud.coveo.com' },
        { name: 'Production (Australia)', value: 'https://platform-au.cloud.coveo.com' },
        { name: 'HIPAA', value: 'https://platformhipaa.cloud.coveo.com' },
        { name: 'QA', value: 'https://platformqa.cloud.coveo.com' },
        { name: 'DEV', value: 'https://platformdev.cloud.coveo.com' },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] !== InteractiveQuestion.UPLOAD_COMMAND;
      },
    };
  }

  getPlatformDestinationEnvironment(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.DESTINATION_ENVIRONMENT,
      message: 'Destination Organization environment',
      default: 'https://platform.cloud.coveo.com',
      choices: [
        { name: 'Production (US)', value: 'https://platform.cloud.coveo.com' },
        { name: 'Production (Europe)', value: 'https://platform.cloud.coveo.com' },
        { name: 'Production (Australia)', value: 'https://platform-au.cloud.coveo.com' },
        { name: 'HIPAA', value: 'https://platformhipaa.cloud.coveo.com' },
        { name: 'QA', value: 'https://platformqa.cloud.coveo.com' },
        { name: 'DEV', value: 'https://platformdev.cloud.coveo.com' },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] !== InteractiveQuestion.DOWNLOAD_COMMAND;
      },
    };
  }

  getCommandList(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.COMMAND,
      message: 'Command to execute?',
      choices: [
        { name: InteractiveQuestion.DIFF_COMMAND },
        { name: InteractiveQuestion.GRADUATE_COMMAND },
        { name: InteractiveQuestion.DOWNLOAD_COMMAND },
        { name: 'rebuild sources', value: InteractiveQuestion.REBUILD_COMMAND },
      ],
    };
  }

  setLogLevel(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.LOG_LEVEL,
      message: 'Log Level',
      default: 'info',
      choices: [{ name: 'nothing' }, { name: 'error' }, { name: 'info' }, { name: 'verbose' }, { name: 'insane' }],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE;
      },
    };
  }

  getContentToDiff(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.OBJECT_TO_MANIPULATE,
      message: 'What would you like to diff?',
      choices: [
        { name: InteractiveQuestion.FIELDS_CONTROLLER_NAME },
        { name: InteractiveQuestion.EXTENSIONS_CONTROLLER_NAME },
        { name: InteractiveQuestion.SOURCES_CONTROLLER_NAME },
        { name: InteractiveQuestion.PAGES_CONTROLLER_NAME },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND].indexOf(InteractiveQuestion.DIFF_COMMAND) !== -1;
      },
    };
  }

  getContentToGraduate(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.OBJECT_TO_MANIPULATE,
      message: 'What would you like to graduate?',
      choices: [
        { name: InteractiveQuestion.FIELDS_CONTROLLER_NAME },
        { name: InteractiveQuestion.EXTENSIONS_CONTROLLER_NAME },
        { name: InteractiveQuestion.SOURCES_CONTROLLER_NAME },
        { name: InteractiveQuestion.PAGES_CONTROLLER_NAME },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.GRADUATE_COMMAND;
      },
    };
  }

  getContentToDownload(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.OBJECT_TO_MANIPULATE,
      message: 'What would you like to download?',
      choices: [
        { name: InteractiveQuestion.FIELDS_CONTROLLER_NAME },
        { name: InteractiveQuestion.EXTENSIONS_CONTROLLER_NAME },
        { name: InteractiveQuestion.SOURCES_CONTROLLER_NAME },
        { name: InteractiveQuestion.PAGES_CONTROLLER_NAME },
      ],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.DOWNLOAD_COMMAND;
      },
    };
  }

  downloadOutput(): DistinctQuestion {
    return {
      type: 'input',
      name: InteractiveQuestion.DOWNLOAD_OUTPUT,
      message: 'Path to output download: ',
      validate: this.inputValidator('You need to provide the path to output the download'),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.DOWNLOAD_COMMAND;
      },
    };
  }

  getSourcesToRebuild(sources: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.SOURCES_TO_REBUILD,
      message: `Select sources to ${underline('rebuild')}. You need to select at least one source.`,
      validate: (s) => {
        return s.length > 0 ? true : 'Select at least one source to rebuild';
      },
      choices: sources,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.REBUILD_COMMAND;
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  setAdvancedConfiguration(): DistinctQuestion {
    return {
      type: 'list',
      name: InteractiveQuestion.ADVANCED_MODE,
      message: 'Options Configuration',
      default: InteractiveQuestion.BASIC_CONFIGURATION_MODE,
      choices: [{ name: InteractiveQuestion.BASIC_CONFIGURATION_MODE }, { name: InteractiveQuestion.ADVANCED_CONFIGURATION_MODE }],
    };
  }

  setKeysToIgnore(fieldModel: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.KEY_TO_IGNORE,
      message: `Select the keys that will no be taken in consideration during the diff`,
      choices: fieldModel,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return (
          answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE &&
          answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.FIELDS_CONTROLLER_NAME &&
          fieldModel.length > 0
        );
      },
    };
  }

  setKeysToIncludeOnly(fieldModel: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.KEY_TO_INCLUDE_ONLY,
      message: `Select the keys that you only want to perform the diff`,
      choices: fieldModel,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return (
          answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE &&
          answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.FIELDS_CONTROLLER_NAME &&
          fieldModel.length > 0
        );
      },
    };
  }

  selectExtensionsToIgnore(extensions: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.IGNORE_EXTENSIONS,
      message: `Select extensions to ${bold('ignore')}.`,
      choices: extensions.map((extension: string) => {
        const isAllMetadataValue =
          ['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'].indexOf(
            StringUtil.lowerAndStripSpaces(extension)
          ) > -1;
        const choice: ListChoiceOptions = {
          name: extension,
          // checked: isAllMetadataValue
        };
        if (isAllMetadataValue) {
          choice.disabled = 'Ignored by default';
        }
        return choice;
      }),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return (
          (answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.SOURCES_CONTROLLER_NAME ||
            answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.EXTENSIONS_CONTROLLER_NAME) &&
          extensions.length > 0
        );
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  selectSourcesForFields(sources: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.SOURCES_TO_IGNORE,
      message: `Select sources from which to load fields. Selecting nothing will load all fields.`,
      choices: sources,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.FIELDS_CONTROLLER_NAME && sources.length > 0;
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  selectSourcesStrategy(sources: string[]): DistinctQuestion {
    // Ask whether the user would like to use the whitelist approach or the blacklist
    return {
      type: 'list',
      name: InteractiveQuestion.SOURCE_STRATEGY,
      message: 'Authentication strategy',
      default: true,
      choices: [{ name: 'whitelist' }, { name: 'blacklist' }, { name: 'none' }],
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        // TODO: Apply to extensions as well
        return answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.SOURCES_CONTROLLER_NAME && sources.length > 0;
      },
    };
  }

  selectSourcesToWhitelist(sources: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.SOURCES,
      message: `Select sources to ${underline('RETRIEVE')}. Selecting nothing will diff all sources`,
      choices: sources,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return (
          answer[InteractiveQuestion.SOURCE_STRATEGY] === 'whitelist' &&
          answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.SOURCES_CONTROLLER_NAME &&
          sources.length > 0
        );
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  selectSourcesToBlacklist(sources: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.SOURCES_TO_IGNORE,
      message: `Select sources to ${underline('IGNORE')}. Selecting nothing will diff all sources`,
      choices: sources,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return (
          answer[InteractiveQuestion.SOURCE_STRATEGY] === 'blacklist' &&
          answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.SOURCES_CONTROLLER_NAME &&
          sources.length > 0
        );
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  selectPagesToIgnore(pages: string[]): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.SOURCES_TO_IGNORE,
      message: `Select sources to ${underline('ignore')}. Selecting nothing will diff all sources`,
      choices: pages,
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.OBJECT_TO_MANIPULATE] === InteractiveQuestion.PAGES_CONTROLLER_NAME && pages.length > 0;
      },
      filter: (input: string) => {
        return `"${input}"`;
      },
    };
  }

  getFileNameForSettings(): DistinctQuestion {
    return this.getGenericFilename(
      InteractiveQuestion.SETTING_FILENAME,
      'command.sh',
      'Enter the filename where the command will be saved: ',
      true
    );
  }

  getFileNameForLogs(): DistinctQuestion {
    return this.getGenericFilename(InteractiveQuestion.LOG_FILENAME, 'logs.json', 'Enter the filename to output logs: ');
  }

  confirmAction(mes: string = 'Are you sure you want to perform this action?', variable: string): DistinctQuestion {
    return {
      type: 'confirm',
      name: variable,
      message: `${bgRed(mes)}`,
      default: false,
    };
  }

  // public executeCommand(): DistinctQuestion {
  //   return {
  //     type: 'confirm',
  //     name: InteractiveQuestion.EXECUTE_COMMAND,
  //     message: 'Would you like to execute the configured command?',
  //     default: false
  //   };
  // }

  getInitialQuestions(data: any): QuestionCollection {
    return [
      this.getCommandList(),
      this.getPlatformOriginEnvironment(),
      this.getPlatformDestinationEnvironment(),
      this.getOriginOrganizationId(),
      this.getDestinationOrganizationId(),
      this.getApiKeyStrategy(),
      // this.getMasterApiKey(),
      this.getOriginApiKey(),
      this.getDestinationApiKey(),

      // If Graduation
      this.getContentToDiff(),
      this.getContentToGraduate(),
      this.getContentToDownload(),
      this.downloadOutput(),
      this.getGraduateOperation(),

      // Common Options
      this.setAdvancedConfiguration(),
      this.setKeysToIgnore(data['fieldModel'] || []), // only execute when in advanced option
      this.setKeysToIncludeOnly(data['fieldModel'] || []), // only execute when in advanced option
    ];
  }

  getFinalQuestions(data?: any): DistinctQuestion[] {
    const questions = [];

    if (data && data.sources) {
      questions.push(this.getSourcesToRebuild(data.sources));
      questions.push(this.selectSourcesForFields(data.sources));
      questions.push(this.selectSourcesStrategy(data.sources));
      questions.push(this.selectSourcesToWhitelist(data.sources));
      questions.push(this.selectSourcesToBlacklist(data.sources));
    }

    if (data && data.extensionsToIgnore) {
      questions.push(this.selectExtensionsToIgnore(data.extensionsToIgnore)); // only execute when in advanced option
    }

    if (data && data.pagesToIgnore) {
      questions.push(this.selectPagesToIgnore(data.pagesToIgnore));
    }

    return union(questions, [this.setLogLevel(), this.getFileNameForLogs(), this.getFileNameForSettings()]);
  }

  private getGraduateOperation(): DistinctQuestion {
    return {
      type: 'checkbox',
      name: InteractiveQuestion.GRADUATE_OPERATIONS,
      message: `Select the allowed operations on the destination organization for the graduation:`,
      choices: ['POST', 'PUT', 'DELETE'],
      validate: this.checkboxValidator('You need to select at least 1 graduate operation.'),
      when: (answer: Answers) => {
        answer = extend(answer, InteractiveQuestion.PREVIOUS_ANSWERS);
        return answer[InteractiveQuestion.COMMAND] === InteractiveQuestion.GRADUATE_COMMAND;
      },
    };
  }

  private getGenericFilename(nameValue: string, defaultValue: string, messageValue: string, alwaysRun: boolean = false): DistinctQuestion {
    return {
      type: 'input',
      name: nameValue,
      default: defaultValue,
      message: messageValue,
      when: (answer: Answers) => alwaysRun || answer[InteractiveQuestion.ADVANCED_MODE] === InteractiveQuestion.ADVANCED_CONFIGURATION_MODE,
    };
  }

  private inputValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyString(input) ? message : true);
  }
  private checkboxValidator(message: string): (input: string, answers?: Answers) => boolean | string {
    return (input: string) => (Utils.isEmptyArray(input) ? message : true);
  }
}
