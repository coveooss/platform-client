import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { StaticErrorMessage } from '../commons/errors';

export interface IPage extends ICoveoObject<Page> {}

export class Page extends BaseCoveoObject implements IPage {
  constructor(private configuration: any) {
    super(configuration['id']);
    // Assert.isNotUndefined(this.configuration['id'], StaticErrorMessage.MISSING_PAGE_ID);
    Assert.isNotUndefined(this.configuration['title'], StaticErrorMessage.MISSING_PAGE_TITLE);
    Assert.isNotUndefined(this.configuration['name'], StaticErrorMessage.MISSING_PAGE_NAME);
    Assert.isNotUndefined(this.configuration['html'], StaticErrorMessage.MISSING_PAGE_HTML);
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
