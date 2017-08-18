// External packages

// Internal packages
import {ICoveoObject} from './ICoveoObject';

export interface IFieldResult {
  Items: ICoveoObject[];
  TotalPages: number;
  TotalEntries: number;
}
