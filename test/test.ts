import { DictionnaryTest } from './commons/collections/DictionnaryTest';
import { DiffUtilsTest } from './utils/DiffUtilsTest';
import { DiffResultArrayTest } from './coveoObjects/DiffResultArrayTest';
import { UrlServiceTest } from './commons/services/UrlServiceTest';
import { config } from '../src/config/index';
import { Logger } from '../src/commons/logger';
import { ArrayUtilTest } from './utils/ArrayUtilsTest';
import { JsonUtilsTest } from './utils/JsonUtilsTest';
import { OrganizationTest } from './coveoObjects/OrganizationTest';

Logger.info(`Environment: ${config.env}\n`);

OrganizationTest();
DictionnaryTest();
DiffResultArrayTest();
DiffUtilsTest();
UrlServiceTest();
ArrayUtilTest();
JsonUtilsTest();
