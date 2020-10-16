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
  static SOMETHING_WENT_WRONG_GRADUATION: string = 'An error occurred during the graduation';

  // Rest
  static FAILED_API_REQUEST: string = 'Unable to perform API request';
  static UNEXPECTED_RESPONSE: string = 'Unexpected response from the server';
  static MISSING_SOURCE_ID_FROM_THE_RESPONSE: string = 'Missing source id from the response';
  static MISSING_EXTENSION_ID_FROM_THE_RESPONSE: string = 'Missing extension id from the response';
  static MISSING_PAGE_ID_FROM_THE_RESPONSE: string = 'Missing page id from the response';

  // Fields
  static MISSING_FIELD_NAME: string = 'Missing field name';
  static UNABLE_TO_LOAD_FIELDS: string = 'Unable to load fields';
  static UNABLE_TO_LOAD_OTHER_FIELDS: string = 'Unable to load other field pages';
  static UNABLE_TO_CREATE_FIELDS: string = 'Unable to create field';
  static UNABLE_TO_UPDATE_FIELDS: string = 'Unable to update field';
  static UNABLE_TO_DELETE_FIELDS: string = 'Unable to delete field';

  // Extensions
  static UNABLE_TO_LOAD_EXTENTIONS: string = 'Unable to load extensions';
  static UNABLE_TO_LOAD_SINGLE_EXTENTION: string = 'Unable to load single extension';
  static UNABLE_TO_CREATE_EXTENSIONS: string = 'Unable to create extension';
  static UNABLE_TO_UPDATE_EXTENSIONS: string = 'Unable to update extension';
  static UNABLE_TO_DELETE_EXTENSIONS: string = 'Unable to delete extension';
  static DUPLICATE_EXTENSION: string = 'There is already an extension with that name in the Organizaton';
  static MISSING_EXTENSION_ID: string = 'Extension id should not be undefined';
  static MISSING_EXTENSION_NAME: string = 'Extension name should not be undefined';
  static MISSING_EXTENSION_CONTENT: string = 'Extension content should not be undefined';
  static MISSING_EXTENSION_DESCRIPTION: string = 'Extension description should not be undefined';
  static MISSING_EXTENSION_REQUIREDDATASTREAMS: string = 'Extension requiredDataStreams should not be undefined';

  // Pages
  static UNABLE_TO_LOAD_PAGES: string = 'Unable to load page';
  static UNABLE_TO_LOAD_SINGLE_PAGE: string = 'Unable to load single page';
  static UNABLE_TO_CREATE_PAGES: string = 'Unable to create page';
  static UNABLE_TO_UPDATE_PAGES: string = 'Unable to update page';
  static UNABLE_TO_DELETE_PAGES: string = 'Unable to delete page';
  static DUPLICATE_PAGE: string = 'There is already an page with that name in the Organizaton';
  static MISSING_PAGE_ID: string = 'Page id should not be undefined';
  static MISSING_PAGE_TITLE: string = 'Page title should not be undefined';
  static MISSING_PAGE_NAME: string = 'Page name should not be undefined';
  static MISSING_PAGE_HTML: string = 'Page html should not be undefined';

  // Sources
  static NO_SOURCE_FOUND: string = 'No source found';
  static UNABLE_TO_GET_SOURCE_NAME: string = 'Unable to load sources';
  static UNABLE_TO_LOAD_SOURCES: string = 'Unable to load sources';
  static UNABLE_TO_CREATE_SOURCE: string = 'Unable to create source';
  static UNABLE_TO_UPDATE_SOURCE: string = 'Unable to update source';
  static UNABLE_TO_DELETE_SOURCE: string = 'Unable to delete source';
  static UNABLE_TO_REBUILD_SOURCE: string = 'Unable to rebuild source';
  static FIELD_INTEGRITY_BROKEN: string = 'Field integrity broken';
  static CANNOT_CREATE_SECURITY_PROVIDER_SOURCE: string = 'Cannot create security provider source';
  static MISSING_SOURCE_ID: string = 'Missing id from source configuration';
  static MISSING_SOURCE_NAME: string = 'Missing name from source configuration';
  static MISSING_SOURCE_MAPPINGS: string = 'Missing mappings from source configuration';
  static MISSING_SOURCE_SOURCETYPE: string = 'Missing sourceType from source configuration';
  static MISSING_SOURCE_PRECONVERSIONEXTENSIONS: string = 'Missing preConversionExtensions from source configuration';
  static MISSING_SOURCE_POSTCONVERSIONEXTENSIONS: string = 'Missing postConversionExtensions from source configuration';
}
