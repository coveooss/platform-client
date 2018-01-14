import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { Organization } from '../../coveoObjects/Organization';
import { Logger } from '../logger';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { ArrayUtils } from '../utils/ArrayUtils';
import { Assert } from '../misc/Assert';
import { IStringMap } from '../interfaces/IStringMap';
import { JsonUtils } from '../utils/JsonUtils';
import { StaticErrorMessage } from '../errors';

export class FieldAPI {
  public static createFields(org: Organization, fieldModels: IStringMap<any>[], fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldModels.length);
    const url = UrlService.createFields(org.getId());
    return Promise.all(
      _.map(ArrayUtils.chunkArray(JsonUtils.clone(fieldModels) as IStringMap<any>[], fieldsPerBatch), (batch: IStringMap<any>[]) => {
        return RequestUtils.post(url, org.getApiKey(), batch);
      })
    );
  }

  public static updateFields(org: Organization, fieldModels: IStringMap<any>[], fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldModels.length);
    const url = UrlService.updateFields(org.getId());
    return Promise.all(
      _.map(ArrayUtils.chunkArray(fieldModels, fieldsPerBatch), (batch: IStringMap<any>[]) => {
        return RequestUtils.put(url, org.getApiKey(), batch);
      })
    );
  }

  public static deleteFields(org: Organization, fieldList: string[], fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldList.length);
    return Promise.all(
      _.map(ArrayUtils.chunkArray(fieldList, fieldsPerBatch), (batch: string[]) => {
        const url = UrlService.deleteFields(org.getId(), batch);
        return RequestUtils.delete(url, org.getApiKey());
      })
    );
  }

  public static getFieldsPage(organization: Organization, page: number): Promise<RequestResponse> {
    Assert.isLargerOrEqualsThan(0, page, 'Parameter "page" cannot be a negative value.');
    Logger.loadingTask(`Fecthing field page ${page} from ${organization.getId()} `);
    return RequestUtils.get(UrlService.getFieldsPageUrl(organization.getId(), page), organization.getApiKey());
  }

  public static loadFields(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getFieldsPage(org, 0)
        .then((response: RequestResponse) => {
          Assert.exists(response.body && response.body.items, StaticErrorMessage.UNEXPECTED_RESPONSE);
          org.addMultipleFields(response.body.items);

          Logger.verbose(`${response.body.items.length} fields found in ${org.getId()}`);
          Logger.verbose(`Successfully loaded first field page from from ${org.getId()}`);
          if (response.body.totalPages > 1) {
            this.loadOtherPages(org, response.body.totalPages)
              .then(() => resolve())
              .catch((err: any) => {
                reject(err);
              });
          } else {
            resolve();
          }
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  }

  public static loadOtherPages(org: Organization, totalPages: number): Promise<void> {
    Assert.isLargerOrEqualsThan(0, totalPages, 'Parameter "totalPages" cannot be a negative value.');
    Logger.loadingTask(`Loading ${totalPages - 1} more pages of fields from ${org.getId()} `);
    const emptyArray: number[] = new Array(totalPages - 1);
    const pageArray = _.map(emptyArray, (v: number, idx: number) => idx + 1);
    return Promise.all(_.map(pageArray, (page: number) => this.getFieldsPage(org, page))).then((otherPages: RequestResponse[]) => {
      Logger.verbose(`Successfully loaded ${totalPages - 1} additional pages of fields from ${org.getId()} `);
      _.each(otherPages, (response: RequestResponse) => {
        Assert.exists(response.body && response.body.items, StaticErrorMessage.UNEXPECTED_RESPONSE);
        org.addMultipleFields(response.body.items);
      });
    });
  }
}
