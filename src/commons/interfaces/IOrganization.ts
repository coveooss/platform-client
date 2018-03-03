import { Extension } from '../../coveoObjects/Extension';
import { Field } from '../../coveoObjects/Field';
import { Source } from '../../coveoObjects/Source';
import { Dictionary } from '../collections/Dictionary';
import { ICoveoObject } from './ICoveoObject';

export interface IOrganization extends ICoveoObject {
  getApiKey(): string;
  getFields(): Dictionary<Field>;
  getSources(): Dictionary<Source>;
  getExtensions(): Dictionary<Extension>;
}
