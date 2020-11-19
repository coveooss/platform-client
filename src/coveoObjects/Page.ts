import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { StaticErrorMessage } from '../commons/errors';
import { PageResource } from './PageResource';
import { Dictionary } from '../commons/collections/Dictionary';

export interface IPage extends ICoveoObject<Page> {}

export class Page extends BaseCoveoObject implements IPage {
  private css: Dictionary<PageResource> = new Dictionary<PageResource>();
  private javascript: Dictionary<PageResource> = new Dictionary<PageResource>();
  constructor(private configuration: any) {
    super(configuration['id']);
    // Assert.isNotUndefined(this.configuration['id'], StaticErrorMessage.MISSING_PAGE_ID);
    Assert.isNotUndefined(this.configuration['title'], StaticErrorMessage.MISSING_PAGE_TITLE);
    Assert.isNotUndefined(this.configuration['name'], StaticErrorMessage.MISSING_PAGE_NAME);
    Assert.isNotUndefined(this.configuration['html'], StaticErrorMessage.MISSING_PAGE_HTML);

    if (this.configuration['javascript'] && Array.isArray(this.configuration['javascript'])) {
      this.configuration['javascript'].map((js: IStringMap<string>) => {
        this.javascript.add(js['name'], new PageResource(this.configuration['javascript']));
      });
    }

    if (this.configuration['css'] && Array.isArray(this.configuration['css'])) {
      (this.configuration['css'] || []).map((css: IStringMap<string>) => {
        this.css.add(css['name'], new PageResource(this.configuration['css']));
      });
    }
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

  getCss(): Dictionary<PageResource> {
    return this.css;
  }

  getJavascript(): Dictionary<PageResource> {
    return this.javascript;
  }

  /**
   * Returns the extension model containing all necessary properties to create it.
   *
   * @returns {IStringMap<any>}
   */
  getConfiguration(): IStringMap<any> {
    return this.configuration;
  }

  clone(): Page {
    return new Page(JsonUtils.clone(this.configuration));
  }
}
