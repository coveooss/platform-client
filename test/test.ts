
// Running Socket server
// require('./../mock/server.js');

import { OrganizationModelTest } from './models/OrganizationModelTest';
import { DictionnaryTest } from './commons/collections/DictionnaryTest';
import { DiffUtilsTest } from './utils/DiffUtilsTest';
import { DiffResultArrayTest } from './models/DiffResultArrayTest';
import { UrlServiceTest } from './commons/services/UrlServiceTest';
import { config } from '../src/config/index';
import { Logger } from '../src/commons/logger';

Logger.info(`Environment: ${config.env}\n`);

OrganizationModelTest();
DictionnaryTest();
DiffResultArrayTest();
DiffUtilsTest();
// UrlServiceTest();
