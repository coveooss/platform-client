import { Answers } from 'inquirer';
import { InteractiveMode } from './InteractiveMode';
import { IGraduateOptions } from '../commands/GraduateCommand';

export interface ISourceContentSettingOptions {
  configuration: boolean;
  objects: boolean;
  mapping: boolean;
  extensions: boolean;
}

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
  };
  graduate: {
    sources?: {
      options: IGraduateOptions,
      content: ISourceContentSettingOptions
    },
    fields?: {
      options: IGraduateOptions
    },
    extensions?: {
      options: IGraduateOptions
    }
  };
}

export class SettingsController {

  static parseSettings(settings: ISettings) {

  }

  static genSettings(answers: Answers): ISettings {
    let settings: ISettings = {
      organizations: {
        origin: {
          id: answers[InteractiveMode.ORIGIN_ORG_ID],
          apiKey: answers[InteractiveMode.ORIGIN_ORG_KEY]
        },
        destination: {
          id: answers[InteractiveMode.DESTINATION_ORG_ID],
          apiKey: answers[InteractiveMode.DESTINATION_ORG_KEY]
        }
      },
      graduate: {}
    };

    // TODO: Remove code duplication
    if (answers[InteractiveMode.CONTENT_TO_GRADUATE]) {
      if (answers[InteractiveMode.CONTENT_TO_GRADUATE].indexOf('fields') !== -1) {
        settings.graduate.fields = {
          options: {
            POST: answers[InteractiveMode.GRADUATE_FIELDS_OPERATION].indexOf('POST') !== -1,
            PUT: answers[InteractiveMode.GRADUATE_FIELDS_OPERATION].indexOf('PUT') !== -1,
            DELETE: answers[InteractiveMode.GRADUATE_FIELDS_OPERATION].indexOf('DELETE') !== -1,
            force: answers[InteractiveMode.FORCE_GRADUATION]
          }
        };
      }

      if (answers[InteractiveMode.CONTENT_TO_GRADUATE].indexOf('extensions') !== -1) {
        settings.graduate.extensions = {
          options: {
            POST: answers[InteractiveMode.GRADUATE_EXTENSIONS_OPERATION].indexOf('POST') !== -1,
            PUT: answers[InteractiveMode.GRADUATE_EXTENSIONS_OPERATION].indexOf('PUT') !== -1,
            DELETE: answers[InteractiveMode.GRADUATE_EXTENSIONS_OPERATION].indexOf('DELETE') !== -1,
            force: answers[InteractiveMode.FORCE_GRADUATION]
          }
        };
      }

      if (answers[InteractiveMode.CONTENT_TO_GRADUATE].indexOf('sources') !== -1) {
        settings.graduate.sources = {
          options: {
            POST: answers[InteractiveMode.GRADUATE_SOURCES_OPERATION].indexOf('POST') !== -1,
            PUT: answers[InteractiveMode.GRADUATE_SOURCES_OPERATION].indexOf('PUT') !== -1,
            DELETE: answers[InteractiveMode.GRADUATE_SOURCES_OPERATION].indexOf('DELETE') !== -1,
            force: answers[InteractiveMode.FORCE_GRADUATION]
          },
          content: {
            configuration: answers[InteractiveMode.SOURCE_CONTENT_TO_GRADUATE].indexOf('configuration') !== -1,
            objects: answers[InteractiveMode.SOURCE_CONTENT_TO_GRADUATE].indexOf('objects') !== -1,
            mapping: answers[InteractiveMode.SOURCE_CONTENT_TO_GRADUATE].indexOf('mapping') !== -1,
            extensions: answers[InteractiveMode.SOURCE_CONTENT_TO_GRADUATE].indexOf('extensions') !== -1
          }
        };
      }
    }

    return settings;
  }
}
