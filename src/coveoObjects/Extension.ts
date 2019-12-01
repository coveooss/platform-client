import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';

export interface IExtention extends ICoveoObject<Extension> {}

export class Extension extends BaseCoveoObject implements IExtention {
  constructor(private configuration: any) {
    super(configuration['id']);
    Assert.isNotUndefined(this.configuration['id'], 'Extension id should not be undefined.');
    Assert.isNotUndefined(this.configuration['content'], 'Extension content should not be undefined.');
    Assert.isNotUndefined(this.configuration['name'], 'Extension name should not be undefined.');
    Assert.isNotUndefined(this.configuration['description'], 'Extension description should not be undefined.');
    Assert.isNotUndefined(this.configuration['requiredDataStreams'], 'Extension requiredDataStreams should not be undefined.');
  }

  getContent(): string {
    return this.configuration['content'];
  }

  getDescription(): string {
    return this.configuration['description'];
  }

  getName(): string {
    return this.configuration['name'];
  }

  getRequiredDataStreams(): string[] {
    return this.configuration['requiredDataStreams'];
  }

  removeParameters(keysToRemove: string[] = [], exclusiveKeys: string[] = []): void {
    this.configuration = JsonUtils.removeKeyValuePairsFromJson(this.configuration, keysToRemove, exclusiveKeys);
  }

  /**
   * Returns the extension model containing all necessary properties to create it.
   *
   * @returns {IStringMap<any>}
   */
  getConfiguration(): IStringMap<any> {
    return this.configuration;
  }

  clone(): Extension {
    return new Extension(JsonUtils.clone(this.configuration));
  }
}
