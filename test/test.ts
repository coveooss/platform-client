import { OrganizationModelTest } from './models/OrganizationModelTest';
import { DictionnaryTest } from './commons/collections/DictionnaryTest';
import { DiffUtilsTest } from './utils/DiffUtilsTest';
import { DiffResultArrayTest } from './models/DiffResultArrayTest';
import { UrlServiceTest } from './commons/services/UrlServiceTest';
import { config } from '../src/config/index';
import { Logger } from '../src/commons/logger';
import { ArrayUtilTest } from './utils/ArrayUtilsTest';
import { JsonUtilsTest } from './utils/JsonUtilsTest';

Logger.info(`Environment: ${config.env}\n`);

OrganizationModelTest();
DictionnaryTest();
DiffResultArrayTest();
DiffUtilsTest();
UrlServiceTest();
ArrayUtilTest();
JsonUtilsTest();
