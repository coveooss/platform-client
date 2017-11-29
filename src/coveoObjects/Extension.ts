import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Assert } from '../commons/misc/Assert';

// TODO: Add a test class
export class Extension extends BaseCoveoObject implements ICoveoObject {
  constructor(id: string, private configuration: any) {
    super(id);
    Assert.isNotUndefined(this.configuration['content']);
    Assert.isNotUndefined(this.configuration['name']);
    Assert.isNotUndefined(this.configuration['description']);
    Assert.isNotUndefined(this.configuration['requiredDataStreams']);
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
}
