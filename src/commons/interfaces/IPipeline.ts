import { IStringMap } from './IStringMap';

export interface IPipeline {
  getFieldModel(): IStringMap<any>;
}
