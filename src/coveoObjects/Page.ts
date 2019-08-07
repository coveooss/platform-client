import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { IPage } from '../commons/interfaces/IPage';
import { BaseCoveoObject } from './BaseCoveoObject';

export class Page extends BaseCoveoObject implements IPage {
  constructor(private configuration: any) {
    super(configuration['id']);
    Assert.isNotUndefined(this.configuration['title'], 'Page title should not be undefined.');
    Assert.isNotUndefined(this.configuration['name'], 'Page name should not be undefined.');
    Assert.isNotUndefined(this.configuration['html'], 'Page html should not be undefined.');
  }

  getHTML(): string {
    return this.configuration['html'];
  }

  getName(): string {
    return this.configuration['name'];
  }

  getTitle(): string {
    return this.configuration['title'];
  }

  /**
   * Returns the extension model containing all necessary properties to create it.
   *
   * @returns {IStringMap<any>}
   */
  getConfiguration(): IStringMap<any> {
    return {
      title: this.getTitle(),
      html: this.getHTML(),
      name: this.getName()
    };
  }

  clone(): Page {
    return new Page(JsonUtils.clone(this.configuration));
  }
}
