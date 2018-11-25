import { Logger } from '../src/commons/logger';
import { config } from '../src/config/index';
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
import { configTest } from './config/indexTest';
import { ExtensionControllerTest } from './controllers/ExtensionControllerTest';
import { FieldControllerTest } from './controllers/FieldControllerTest';
import { SourceControllerTest } from './controllers/SourceControllerTest';
import { ExtensionTest } from './coveoObjects/ExtensionTest';
import { FieldTest } from './coveoObjects/FieldTest';
import { OrganizationTest } from './coveoObjects/OrganizationTest';
import { SourceTest } from './coveoObjects/SourceTest';
import { SourceAPITest } from './commons/rest/SourceAPITest';

console.log(`Environment: ${config.env}\n`);

Logger.disableSpinner();

// Coveo Objects
FieldTest();
ExtensionTest();
OrganizationTest();
SourceTest();

// Controllers
FieldControllerTest();
ExtensionControllerTest();
SourceControllerTest();

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

// Utils
ArrayUtilTest();
DiffUtilsTest();
DownloadUtilsTest();
EnvironmentUtilsTest();
FileUtilsTest();
JsonUtilsTest();
RequestUtilsTest();
UtilsTest();

// Config
configTest();

// Console
// ConsoleTest();
