export interface IGenericError {
  orgId: string;
  message: any;
}

export class StaticErrorMessage {
  // Base Coveo Object
  public static INVALID_ID: string = 'Id should not be undefined';

  public static UNABLE_TO_DIFF: string = 'Diff operation failed';
  public static UNABLE_TO_DOWNLOAD: string = 'Downlaod operation failed';
  public static UNABLE_TO_GRADUATE: string = 'Graduation opertaion failed';

  // Rest
  public static FAILED_API_REQUEST: string = 'Unable to perform API request';
  public static UNEXPECTED_RESPONSE: string = 'Unexpected response from the server';

  // Fields
  public static MISSING_FIELD_NAME: string = 'Missing field name';
  public static UNABLE_TO_LOAD_FIELDS: string = 'Unable to load fields';
  public static UNABLE_TO_LOAD_OTHER_FIELDS: string = 'Unable to load other field pages';
  public static UNABLE_TO_CREATE_FIELDS: string = 'Unable to create field';
  public static UNABLE_TO_UPDATE_FIELDS: string = 'Unable to update field';
  public static UNABLE_TO_DELETE_FIELDS: string = 'Unable to delete field';

  // Extensions
  public static UNABLE_TO_LOAD_EXTENTIONS: string = 'Unable to load extensions';
  public static UNABLE_TO_LOAD_SINGLE_EXTENTION: string = 'Unable to load single extension';
  public static UNABLE_TO_CREATE_EXTENSIONS: string = 'Unable to create extension';
  public static UNABLE_TO_UPDATE_EXTENSIONS: string = 'Unable to update extension';
  public static UNABLE_TO_DELETE_EXTENSIONS: string = 'Unable to delete extension';
  public static DUPLICATE_EXTENSION: string = 'There is already an extension with that name in the Organizaton';
}
