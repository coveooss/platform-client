import { ISource } from '../commons/interfaces/ISource';
import { BaseCoveoObject } from './BaseCoveoObject';
import { IStringMap } from '../commons/interfaces/IStringMap';

export class Source extends BaseCoveoObject implements ISource {

  constructor(
    id: string,
    private configuration: any,
    private mappings: Array<IStringMap<string>>,
    private preConversionExtensions: any[],
    private postConversionExtensions: any[]
  ) {
    super(id);
  }

  getMappings(): Array<IStringMap<string>> {
    return this.mappings;
  }

  getPostConversionExtensions(): any[] {
    return this.postConversionExtensions;
  }

  getPreConversionExtensions() {
    return this.postConversionExtensions;
  }

  getConfiguration(): any {
    return this.configuration;
  }
}
