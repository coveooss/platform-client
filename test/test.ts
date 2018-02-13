import { FieldControllerTest } from './controllers/FieldControllerTest';
import { ExtensionControllerTest } from './controllers/ExtensionControllerTest';
import { BaseControllerTest } from './controllers/BaseControllerTest';
import { SourceTest } from './coveoObjects/SourceTest';
import { configTest } from './config/indexTest';
import { LoggerTest } from './commons/loggerTest';
import { ArrayUtilTest } from './commons/utils/ArrayUtilsTest';
import { DiffUtilsTest } from './commons/utils/DiffUtilsTest';
import { ExtensionAPITest } from './commons/rest/ExtensionAPITest';
import { FieldAPITest } from './commons/rest/FieldAPITest';
import { DictionaryTest } from './commons/collections/DictionaryTest';
import { DiffResultArrayTest } from './commons/collections/DiffResultArrayTest';
import { UrlServiceTest } from './commons/rest/UrlServiceTest';
import { config } from '../src/config/index';
import { OrganizationTest } from './coveoObjects/OrganizationTest';
import { FieldTest } from './coveoObjects/FieldTest';
import { ExtensionTest } from './coveoObjects/ExtensionTest';
import { AssertTest } from './commons/misc/AssertTest';
import { JsonUtilsTest } from './commons/utils/JsonUtilsTest';
import { FileUtilsTest } from './commons/utils/FileUtilsTest';
import { RequestUtilsTest } from './commons/utils/RequestUtilsTest';
import { BaseCoveoObjectTest } from './coveoObjects/BaseCoveoObjectTest';
import { Logger } from '../src/commons/logger';
import { ErrorTest } from './commons/errorTest';
import { EnvironmentUtilsTest } from './commons/utils/EnvironmentUtils';
import { UtilsTest } from './commons/utils/UtilsTest';
import { ConsoleTest } from './consoleTest';

console.log(`Environment: ${config.env}\n`);

Logger.disableSpinner();

// Coveo Objects
FieldTest();
ExtensionTest();
BaseCoveoObjectTest();
OrganizationTest();
SourceTest();

// Controllers
BaseControllerTest();
FieldControllerTest();
ExtensionControllerTest();

// Common / Collection
DictionaryTest();
DiffResultArrayTest();

// Common
LoggerTest();
ErrorTest();

// Common / Misc
AssertTest();

// Common / Rest
FieldAPITest();
ExtensionAPITest();
UrlServiceTest();

// Utils
ArrayUtilTest();
DiffUtilsTest();
EnvironmentUtilsTest();
FileUtilsTest();
JsonUtilsTest();
RequestUtilsTest();
UtilsTest();

// Config
configTest();

// Console
// ConsoleTest();
