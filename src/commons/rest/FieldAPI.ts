import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { Organization } from '../../coveoObjects/Organization';
import { Colors } from '../colors';
import { IGenericError, StaticErrorMessage } from '../errors';
import { IStringMap } from '../interfaces/IStringMap';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';
import { ArrayUtils } from '../utils/ArrayUtils';
import { JsonUtils } from '../utils/JsonUtils';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';

export class FieldAPI {
  static getFieldDefinitions(): Promise<RequestResponse> {
    const url = UrlService.getFieldDocs();
    return RequestUtils.get(url, '');
  }

  static createFields(org: Organization, fieldModels: Array<IStringMap<any>>, fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldModels.length);
    const url = UrlService.createFields(org.getId());
    return Promise.all(
      _.map(
        ArrayUtils.chunkArray(JsonUtils.clone(fieldModels) as Array<IStringMap<any>>, fieldsPerBatch),
        (batch: Array<IStringMap<any>>) => {
          return RequestUtils.post(url, org.getApiKey(), batch);
        }
      )
    );
  }

  static updateFields(org: Organization, fieldModels: Array<IStringMap<any>>, fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldModels.length);
    const url = UrlService.updateFields(org.getId());
    return Promise.all(
      _.map(ArrayUtils.chunkArray(fieldModels, fieldsPerBatch), (batch: Array<IStringMap<any>>) => {
        return RequestUtils.put(url, org.getApiKey(), batch);
      })
    );
  }

  static deleteFields(org: Organization, fieldList: string[], fieldsPerBatch: number): Promise<RequestResponse[]> {
    Assert.isLargerThan(0, fieldList.length);
    return Promise.all(
      _.map(ArrayUtils.chunkArray(fieldList, fieldsPerBatch), (batch: string[]) => {
        const url = UrlService.deleteFields(org.getId(), batch);
        return RequestUtils.delete(url, org.getApiKey());
      })
    );
  }

  static getFieldsPage(organization: Organization, page: number): Promise<RequestResponse> {
    Assert.isLargerOrEqualsThan(0, page, 'Parameter "page" cannot be a negative value.');
    Logger.loadingTask(`Fetching field page ${page} from ${Colors.organization(organization.getId())} `);
    return RequestUtils.get(UrlService.getFieldsPageUrl(organization.getId(), page), organization.getApiKey());
  }

  static loadFields(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getFieldsPage(org, 0)
        .then((response: RequestResponse) => {
          Assert.exists(response.body && response.body.items, StaticErrorMessage.UNEXPECTED_RESPONSE);
          org.addFieldList(response.body.items);

          Logger.verbose(`${response.body.items.length} fields found in ${Colors.organization(org.getId())}`);
          Logger.verbose(`Successfully loaded first field page from ${Colors.organization(org.getId())}`);
          if (response.body.totalPages > 1) {
            this.loadOtherPages(org, response.body.totalPages)
              .then(() => resolve())
              .catch((err: any) => {
                reject({ orgId: org.getId(), message: err } as IGenericError);
              });
          } else {
            resolve();
          }
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static getFieldsWithSourcesPage(organization: Organization, page: number): Promise<RequestResponse> {
    Assert.isLargerOrEqualsThan(0, page, 'Parameter "page" cannot be a negative value.');
    Logger.loadingTask(`Fetching field page ${page} from ${Colors.organization(organization.getId())} `);
    return RequestUtils.get(UrlService.getFieldsWithSourcesPageUrl(organization.getId(), page), organization.getApiKey());
  }

  static loadFieldsWithSources(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getFieldsWithSourcesPage(org, 0)
        .then((response: RequestResponse) => {
          Assert.exists(response.body && response.body.items, StaticErrorMessage.UNEXPECTED_RESPONSE);
          response.body.items.forEach((item: IStringMap<any>) => {
            if (item.mappings) {
              delete item.mappings;
            }
          });
          org.addFieldList(response.body.items);

          Logger.verbose(`${response.body.items.length} fields found in ${Colors.organization(org.getId())}`);
          Logger.verbose(`Successfully loaded first field page from ${Colors.organization(org.getId())}`);
          if (response.body.totalPages > 1) {
            this.loadOtherPages(org, response.body.totalPages)
              .then(() => resolve())
              .catch((err: any) => {
                reject({ orgId: org.getId(), message: err } as IGenericError);
              });
          } else {
            resolve();
          }
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static loadOtherPages(org: Organization, totalPages: number): Promise<void> {
    Assert.isLargerOrEqualsThan(0, totalPages, 'Parameter "totalPages" cannot be a negative value.');
    Logger.loadingTask(`Loading ${totalPages - 1} more pages of fields from ${Colors.organization(org.getId())} `);
    const emptyArray: number[] = new Array(totalPages - 1);
    const pageArray = _.map(emptyArray, (v: number, idx: number) => idx + 1);
    return Promise.all(_.map(pageArray, (page: number) => this.getFieldsPage(org, page))).then((otherPages: RequestResponse[]) => {
      Logger.verbose(`Successfully loaded ${totalPages - 1} additional pages of fields from ${Colors.organization(org.getId())} `);
      _.each(otherPages, (response: RequestResponse) => {
        Assert.exists(response.body && response.body.items, StaticErrorMessage.UNEXPECTED_RESPONSE);
        org.addFieldList(response.body.items);
      });
    });
  }
}
