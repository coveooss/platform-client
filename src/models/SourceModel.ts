import { ISource } from '../commons/interfaces/ISource';
import { BaseModel } from './BaseModel';
import { IStringMap } from '../commons/interfaces/IStringMap';

export class Source extends BaseModel implements ISource {
  private mappings: IStringMap<string>[] = [];
  private preConversionExtensions: any[] = [];
  private postConversionExtensions: any[] = [];
  private extendedDataFiles: any = '';

  get Mappings(): IStringMap<string>[] {
    return this.mappings;
  }

  set Mappings(value: IStringMap<string>[]) {
    this.mappings = value;
  }

  get PreConversionExtensions(): any[] {
    return this.preConversionExtensions;
  }

  set PreConversionExtensions(value: any[]) {
    this.preConversionExtensions = value;
  }

  get PostConversionExtensions(): any[] {
    return this.postConversionExtensions;
  }

  set PostConversionExtensions(value: any[]) {
    this.postConversionExtensions = value;
  }

  get ExtendedDataFiles(): any {
    return this.extendedDataFiles;
  }

  set ExtendedDataFiles(value: any) {
    this.extendedDataFiles = value;
  }

  constructor(id: string, configuration: any) {
    super(id);
    this.Configuration = configuration;
  }
}
