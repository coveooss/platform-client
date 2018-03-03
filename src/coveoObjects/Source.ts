import { ISource } from '../commons/interfaces/ISource';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';

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
    return this.preConversionExtensions;
  }

  getConfiguration(): any {
    return this.configuration;
  }

  clone(): Source {
    return new Source(
      this.getId(),
      JsonUtils.clone(this.getConfiguration()),
      JsonUtils.clone(this.getMappings()),
      JsonUtils.clone(this.getPostConversionExtensions()),
      JsonUtils.clone(this.getPreConversionExtensions())
    );
  }
}
