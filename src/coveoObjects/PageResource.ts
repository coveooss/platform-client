import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { StaticErrorMessage } from '../commons/errors';

export interface IPageResource extends ICoveoObject<PageResource> {}

export class PageResource extends BaseCoveoObject implements IPageResource {
  constructor(private configuration: any) {
    super(configuration['Name']);
    Assert.isNotUndefined(this.configuration['Name'], StaticErrorMessage.MISSING_PAGE_RESOURCE_NAME);
    Assert.isNotUndefined(this.configuration['URL'], StaticErrorMessage.MISSING_PAGE_RESOURCE_URL);
    Assert.isNotUndefined(this.configuration['InlineContent'], StaticErrorMessage.MISSING_PAGE_RESOURCE_INLINECONTENT);
  }

  getName(): string {
    return this.configuration['Name'];
  }

  getConfiguration(): IStringMap<any> {
    return this.configuration;
  }

  clone(): PageResource {
    return new PageResource(JsonUtils.clone(this.configuration));
  }
}
