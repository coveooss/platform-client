import { ICoveoObject } from './ICoveoObject';
import { Source } from '../../coveoObjects/Source';
import { Field } from '../../coveoObjects/Field';
import { Dictionary } from '../collections/Dictionary';
import { Extension } from '../../coveoObjects/Extension';

export interface IOrganization extends ICoveoObject {
  getApiKey(): string;
  getFields(): Dictionary<Field>;
  getSources(): Dictionary<Source>;
  getExtensions(): Dictionary<Extension>;
}
