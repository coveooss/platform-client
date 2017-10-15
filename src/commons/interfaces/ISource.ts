import { IStringMap } from './IStringMap';

export interface ISource {
  Id: string;
  Configuration: any;
  Mappings: IStringMap<string>[];
  PreConversionExtensions: any[];
  PostConversionExtensions: any[];
  ExtendedDataFiles: any;
};
