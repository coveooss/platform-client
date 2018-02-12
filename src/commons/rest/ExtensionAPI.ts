import * as _ from 'underscore';
import { RequestResponse } from 'request';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { Organization } from '../../coveoObjects/Organization';
import { Extension } from '../../coveoObjects/Extension';
import { IStringMap } from '../interfaces/IStringMap';
import { Assert } from '../misc/Assert';
import { Logger } from '../logger';
import { StaticErrorMessage, IGenericError } from '../errors';
import { Colors } from '../colors';
import { ArrayUtils } from '../utils/ArrayUtils';
import { JsonUtils } from '../utils/JsonUtils';

export class ExtensionAPI {
  public static createExtension(org: Organization, extensionModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getExtensionsUrl(org.getId());
    return RequestUtils.post(url, org.getApiKey(), extensionModel);
  }

  public static updateExtension(org: Organization, extensionId: string, extensionModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getSingleExtensionUrl(org.getId(), extensionId);
    return RequestUtils.put(url, org.getApiKey(), extensionModel);
  }

  public static deleteExtension(org: Organization, extensionId: string): Promise<RequestResponse> {
    const url = UrlService.getSingleExtensionUrl(org.getId(), extensionId);
    return RequestUtils.delete(url, org.getApiKey());
  }

  public static getAllExtensions(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(UrlService.getExtensionsUrl(organization.getId()), organization.getApiKey());
  }

  public static getSingleExtension(organization: Organization, extensionId: string) {
    Assert.isNotUndefined(extensionId, 'Cannot load undefined extension');
    return RequestUtils.get(UrlService.getSingleExtensionUrl(organization.getId(), extensionId), organization.getApiKey());
  }

  public static loadExtensions(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // Load all extensions
      this.getAllExtensions(org)
        .then((response: RequestResponse) => {
          // Load each extension
          ExtensionAPI.loadEachExtension(org, response)
            .then(() => resolve())
            .catch((err: any) => {
              reject({ orgId: org.getId(), message: err } as IGenericError);
            });
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  public static loadEachExtension(org: Organization, response: RequestResponse) {
    Logger.verbose(`${response.body.length} extensions found from ${Colors.organization(org.getId())}`);
    return Promise.all(
      _.map(response.body, (extension: any) => {
        Assert.exists(extension['id'], StaticErrorMessage.UNEXPECTED_RESPONSE);
        Logger.loadingTask(`Loading ${Colors.extension(extension['name'])} extension from ${Colors.organization(org.getId())}`);
        // tslint:disable-next-line:typedef
        return new Promise((resolve, reject) => {
          return this.getSingleExtension(org, extension['id'])
            .then((extensionBody: RequestResponse) => {
              Logger.verbose(
                `Successfully loaded ${Colors.extension(extension['name'])} extension from ${Colors.organization(org.getId())}`
              );
              // TODO: add this function as a callback since it doesn't make sense to put it here
              this.addLoadedExtensionsToOrganization(org, extensionBody.body);
              // TODO: add the extensionBody.body in the resolve
              resolve();
            })
            .catch((err: any) => {
              reject({ orgId: org.getId(), message: err } as IGenericError);
            });
        });
      })
    );
  }

  public static addLoadedExtensionsToOrganization(org: Organization, rawExtension: IStringMap<any>) {
    const extension = new Extension(rawExtension);
    org.addExtension(extension);
  }
}
