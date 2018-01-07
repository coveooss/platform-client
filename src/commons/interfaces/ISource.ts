import { IStringMap } from './IStringMap';

export interface ISource {
  getId(): string;
  getConfiguration(): any;
  getMappings(): IStringMap<string>[];
  getPreConversionExtensions(): any[];
  getPostConversionExtensions(): any[];
}
