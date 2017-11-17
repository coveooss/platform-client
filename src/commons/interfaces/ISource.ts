import { IStringMap } from './IStringMap';

export interface ISource {
  getId(): string;
  getConfiguration(): any;
  getMappings(): Array<IStringMap<string>>;
  getPreConversionExtensions(): any[];
  getPostConversionExtensions(): any[];
}
