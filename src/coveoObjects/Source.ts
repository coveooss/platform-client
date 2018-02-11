import { ISource } from '../commons/interfaces/ISource';
import { BaseCoveoObject } from './BaseCoveoObject';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';

export class Source extends BaseCoveoObject implements ISource {
  constructor(
    id: string,
    private configuration: any,
    private mappings: IStringMap<string>[],
    private preConversionExtensions: any[],
    private postConversionExtensions: any[]
  ) {
    super(id);
  }

  public getMappings(): IStringMap<string>[] {
    return this.mappings;
  }

  public getPostConversionExtensions(): any[] {
    return this.postConversionExtensions;
  }

  public getPreConversionExtensions() {
    return this.preConversionExtensions;
  }

  public getConfiguration(): any {
    return this.configuration;
  }

  public clone(): Source {
    return new Source(
      this.getId(),
      JsonUtils.clone(this.getConfiguration()),
      JsonUtils.clone(this.getMappings()),
      JsonUtils.clone(this.getPostConversionExtensions()),
      JsonUtils.clone(this.getPreConversionExtensions())
    );
  }
}
