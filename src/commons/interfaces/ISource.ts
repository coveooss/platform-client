import { IStringMap } from './IStringMap';
import { ICoveoObject } from './ICoveoObject';
import { Source } from '../../coveoObjects/Source';

export interface ISource extends ICoveoObject<Source> {
  getMappings(): Array<IStringMap<string>>;
  getPreConversionExtensions(): any[];
  getPostConversionExtensions(): any[];
}
