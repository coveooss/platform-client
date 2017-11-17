import { ICoveoObject } from './ICoveoObject';
import { Source } from '../../coveoObjects/Source';
import { BaseCoveoObject } from '../../coveoObjects/BaseCoveoObject';
import { Field } from '../../coveoObjects/Field';
import { Dictionary } from '../collections/Dictionary';

export interface IOrganization extends ICoveoObject {
  getApiKey(): string;
  getFields(): Dictionary<Field>;
  getSources(): Dictionary<Source>;
  getExtensions(): Dictionary<BaseCoveoObject>;
}
