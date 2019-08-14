import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { IExtention } from '../commons/interfaces/IExtension';

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

  /**
   * Returns the extension model containing all necessary properties to create it.
   *
   * @returns {IStringMap<any>}
   */
  getConfiguration(): IStringMap<any> {
    return {
      content: this.getContent(),
      description: this.getDescription(),
      name: this.getName(),
      requiredDataStreams: this.getRequiredDataStreams()
    };
  }

  clone(): Extension {
    return new Extension(JsonUtils.clone(this.configuration));
  }
}
