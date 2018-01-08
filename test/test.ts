import { SourceControllerTest } from './controllers/SourceControllerTest';
import { OrganizationControllerTest } from './controllers/OrganizationControllerTest';
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

console.log(`Environment: ${config.env}\n`);

Logger.disableSpinner();

OrganizationTest();
DictionaryTest();
DiffResultArrayTest();
DiffUtilsTest();
UrlServiceTest();
ArrayUtilTest();
JsonUtilsTest();
FieldTest();
ExtensionTest();

// TODO:
// TODO: setting controller

AssertTest();
FieldAPITest();
ExtensionAPITest();
FileUtilsTest();
RequestUtilsTest();
LoggerTest();

configTest();

BaseCoveoObjectTest();
SourceTest();

BaseControllerTest();
ExtensionControllerTest();
FieldControllerTest();
OrganizationControllerTest();
SourceControllerTest();
