export interface IGenericError {
  orgId: string;
  message: any;
}

export class StaticErrorMessage {
  // Base Coveo Object
  static INVALID_ID: string = 'Id should not be undefined';

  static UNABLE_TO_DIFF: string = 'Diff operation failed';
  static UNABLE_TO_DOWNLOAD: string = 'Download operation failed';
  static UNABLE_TO_GRADUATE: string = 'Graduation operation failed';

  // Rest
  static FAILED_API_REQUEST: string = 'Unable to perform API request';
  static UNEXPECTED_RESPONSE: string = 'Unexpected response from the server';
  static MISSING_SOURCE_ID_FROM_THE_RESPONSE: string = 'Missing source id from the response';
  static MISSING_EXTENSION_ID_FROM_THE_RESPONSE: string = 'Missing extension id from the response';

  // Fields
  static MISSING_FIELD_NAME: string = 'Missing field name';
  static UNABLE_TO_LOAD_FIELDS: string = 'Unable to load fields';
  static UNABLE_TO_LOAD_OTHER_FIELDS: string = 'Unable to load other field pages';
  static UNABLE_TO_CREATE_FIELDS: string = 'Unable to create field';
  static UNABLE_TO_UPDATE_FIELDS: string = 'Unable to update field';
  static UNABLE_TO_DELETE_FIELDS: string = 'Unable to delete field';

  // Extensions
  static UNABLE_TO_LOAD_SOURCES: string = 'Unable to load sources';
  static UNABLE_TO_LOAD_EXTENTIONS: string = 'Unable to load extensions';
  static UNABLE_TO_LOAD_SINGLE_EXTENTION: string = 'Unable to load single extension';
  static UNABLE_TO_CREATE_EXTENSIONS: string = 'Unable to create extension';
  static UNABLE_TO_UPDATE_EXTENSIONS: string = 'Unable to update extension';
  static UNABLE_TO_DELETE_EXTENSIONS: string = 'Unable to delete extension';
  static DUPLICATE_EXTENSION: string = 'There is already an extension with that name in the Organizaton';
}
