import { IStringMap } from './IStringMap';

export interface IField {
  getFieldModel(): IStringMap<string>;
}
