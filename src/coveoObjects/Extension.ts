import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';

export class Extension extends BaseCoveoObject implements ICoveoObject {
  constructor(private configuration: any) {
    super(configuration['id']);
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
  getExtensionModel(): IStringMap<any> {
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
