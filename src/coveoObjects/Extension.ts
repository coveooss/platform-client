import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { StaticErrorMessage } from '../commons/errors';

export interface IExtention extends ICoveoObject<Extension> {}

export class Extension extends BaseCoveoObject implements IExtention {
  constructor(private configuration: any) {
    super(configuration['id']);
    // Assert.isNotUndefined(this.configuration['id'], StaticErrorMessage.MISSING_EXTENSION_ID);
    Assert.isNotUndefined(this.configuration['name'], StaticErrorMessage.MISSING_EXTENSION_NAME);
    Assert.isNotUndefined(this.configuration['content'], StaticErrorMessage.MISSING_EXTENSION_CONTENT);
    Assert.isNotUndefined(this.configuration['description'], StaticErrorMessage.MISSING_EXTENSION_DESCRIPTION);
    Assert.isNotUndefined(this.configuration['requiredDataStreams'], StaticErrorMessage.MISSING_EXTENSION_REQUIREDDATASTREAMS);
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
