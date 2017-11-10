import { IAnswer } from './InteractiveMode';

export interface IGraduateSettingOptions {
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
  force: boolean;
}

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
      options: IGraduateSettingOptions,
      content: ISourceContentSettingOptions
    },
    fields?: {
      options: IGraduateSettingOptions
    },
    extensions?: {
      options: IGraduateSettingOptions
    }
  };
}

export class SettingsController {

  static parseSettings(settings: ISettings) {

  }

  static genSettings(answers: IAnswer): ISettings {
    let settings: ISettings = {
      organizations: {
        origin: {
          id: answers.originOrganizationId,
          apiKey: answers.originOrganizationKey
        },
        destination: {
          id: answers.destinationOrganizationId,
          apiKey: answers.destinationOrganizationKey
        }
      },
      graduate: {}
    };

    // TODO: Remove code duplication
    if (answers.contentToGraduate) {
      if (answers.contentToGraduate.indexOf('fields') !== -1) {
        settings.graduate.fields = {
          options: {
            POST: answers.graduateFieldsOperation.indexOf('POST') !== -1,
            PUT: answers.graduateFieldsOperation.indexOf('PUT') !== -1,
            DELETE: answers.graduateFieldsOperation.indexOf('DELETE') !== -1,
            force: answers.force
          }
        };
      }

      if (answers.contentToGraduate.indexOf('extensions') !== -1) {
        settings.graduate.extensions = {
          options: {
            POST: answers.graduateExtensionsOperation.indexOf('POST') !== -1,
            PUT: answers.graduateExtensionsOperation.indexOf('PUT') !== -1,
            DELETE: answers.graduateExtensionsOperation.indexOf('DELETE') !== -1,
            force: answers.force
          }
        };
      }

      if (answers.contentToGraduate.indexOf('sources') !== -1) {
        settings.graduate.sources = {
          options: {
            POST: answers.graduateSourceOperation.indexOf('POST') !== -1,
            PUT: answers.graduateSourceOperation.indexOf('PUT') !== -1,
            DELETE: answers.graduateSourceOperation.indexOf('DELETE') !== -1,
            force: answers.force
          },
          content: {
            configuration: answers.sourceContentToGraduate.indexOf('configuration') !== -1,
            objects: answers.sourceContentToGraduate.indexOf('objects') !== -1,
            mapping: answers.sourceContentToGraduate.indexOf('mapping') !== -1,
            extensions: answers.sourceContentToGraduate.indexOf('extensions') !== -1
          }
        };
      }
    }

    return settings;
  }
}
