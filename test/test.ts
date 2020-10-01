import { Logger } from '../src/commons/logger';
import { DictionaryTest } from './commons/collections/DictionaryTest';
import { DiffResultArrayTest } from './commons/collections/DiffResultArrayTest';
import { DownloadResultArrayTest } from './commons/collections/DownloadResultArrayTest';
import { ErrorTest } from './commons/errorTest';
import { LoggerTest } from './commons/loggerTest';
import { ExtensionAPITest } from './commons/rest/ExtensionAPITest';
import { FieldAPITest } from './commons/rest/FieldAPITest';
import { UrlServiceTest } from './commons/rest/UrlServiceTest';
import { ArrayUtilTest } from './commons/utils/ArrayUtilsTest';
import { DiffUtilsTest } from './commons/utils/DiffUtilsTest';
import { DownloadUtilsTest } from './commons/utils/DownloadUtilsTest';
import { EnvironmentUtilsTest } from './commons/utils/EnvironmentUtils';
import { FileUtilsTest } from './commons/utils/FileUtilsTest';
import { JsonUtilsTest } from './commons/utils/JsonUtilsTest';
import { RequestUtilsTest } from './commons/utils/RequestUtilsTest';
import { UtilsTest } from './commons/utils/UtilsTest';
import { ExtensionControllerTest } from './controllers/ExtensionControllerTest';
import { FieldControllerTest } from './controllers/FieldControllerTest';
import { SourceControllerTest } from './controllers/SourceControllerTest';
import { ExtensionTest } from './coveoObjects/ExtensionTest';
import { FieldTest } from './coveoObjects/FieldTest';
import { OrganizationTest } from './coveoObjects/OrganizationTest';
import { SourceTest } from './coveoObjects/SourceTest';
import { SourceAPITest } from './commons/rest/SourceAPITest';
import { AssertTest } from './commons/misc/AssertTest';
import { PageControllerTest } from './controllers/PageControllerTest';
import { PageTest } from './coveoObjects/PageTest';
import { PageAPITest } from './commons/rest/PageAPITest';
import { IOrganizationOptions, Organization } from '../src/coveoObjects/Organization';

Logger.disableSpinner();

// TODO: put this class into a separate file
export class TestOrganization extends Organization {
  constructor(id: string, apiKey: string, options: IOrganizationOptions = {}) {
    super(id, apiKey, options);
  }
}

// Coveo Objects
FieldTest();
ExtensionTest();
OrganizationTest();
SourceTest();
PageTest();

// Controllers
FieldControllerTest();
ExtensionControllerTest();
SourceControllerTest();
PageControllerTest();

// Common / Collection
DictionaryTest();
DiffResultArrayTest();
DownloadResultArrayTest();

// Common
LoggerTest();
ErrorTest();

// Common / Rest
FieldAPITest();
ExtensionAPITest();
SourceAPITest();
UrlServiceTest();
PageAPITest();

// Utils
ArrayUtilTest();
DiffUtilsTest();
DownloadUtilsTest();
EnvironmentUtilsTest();
FileUtilsTest();
JsonUtilsTest();
RequestUtilsTest();
UtilsTest();

// Assert
AssertTest();

// Console
// ConsoleTest();
