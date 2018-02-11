import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';

export class Extension extends BaseCoveoObject implements ICoveoObject {
  constructor(id: string, private configuration: any) {
    super(id);
    Assert.isNotUndefined(this.configuration['content'], 'Extension content should not be undefined.');
    Assert.isNotUndefined(this.configuration['name'], 'Extension name should not be undefined.');
    Assert.isNotUndefined(this.configuration['description'], 'Extension description should not be undefined.');
    Assert.isNotUndefined(this.configuration['requiredDataStreams'], 'Extension requiredDataStreams should not be undefined.');
  }

  public getContent(): string {
    return this.configuration['content'];
  }

  public getDescription(): string {
    return this.configuration['description'];
  }

  public getName(): string {
    return this.configuration['name'];
  }

  public getRequiredDataStreams(): string[] {
    return this.configuration['requiredDataStreams'];
  }

  public clone(): Extension {
    return new Extension(this.getId(), JsonUtils.clone(this.configuration));
  }
}
