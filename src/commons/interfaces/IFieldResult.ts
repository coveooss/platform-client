// External packages

// Internal packages
import {ICoveoObject} from './ICoveoObject';
import {IField} from './IField';

export interface IFieldResult extends ICoveoObject {
  Items: IField[];
  TotalPages: number;
  TotalEntries: number;
}
