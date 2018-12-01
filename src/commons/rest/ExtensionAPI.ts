import { RequestResponse } from 'request';
import * as _ from 'underscore';
import { Extension } from '../../coveoObjects/Extension';
import { Organization } from '../../coveoObjects/Organization';
import { Colors } from '../colors';
import { IGenericError, StaticErrorMessage } from '../errors';
import { IStringMap } from '../interfaces/IStringMap';
import { Logger } from '../logger';
import { Assert } from '../misc/Assert';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';

export class ExtensionAPI {
  static createExtension(org: Organization, extensionModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getExtensionsUrl(org.getId());
    return RequestUtils.post(url, org.getApiKey(), extensionModel);
  }

  static updateExtension(org: Organization, extensionId: string, extensionModel: IStringMap<any>): Promise<RequestResponse> {
    const url = UrlService.getSingleExtensionUrl(org.getId(), extensionId);
    return RequestUtils.put(url, org.getApiKey(), extensionModel);
  }

  static deleteExtension(org: Organization, extensionId: string): Promise<RequestResponse> {
    const url = UrlService.getSingleExtensionUrl(org.getId(), extensionId);
    return RequestUtils.delete(url, org.getApiKey());
  }

  static getAllExtensions(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(UrlService.getExtensionsUrl(organization.getId()), organization.getApiKey());
  }

  static getSingleExtension(organization: Organization, extensionId: string): Promise<RequestResponse> {
    Assert.isNotUndefined(extensionId, 'Cannot load undefined extension');
    return RequestUtils.get(UrlService.getSingleExtensionUrl(organization.getId(), extensionId), organization.getApiKey());
  }

  static loadExtensions(org: Organization): Promise<{}> {
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

  static getExtensionList(org: Organization): Promise<Array<{}>> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      this.getAllExtensions(org)
        .then((response: RequestResponse) => {
          if (!Array.isArray(response.body)) {
            reject({
              orgId: org.getId(),
              message: 'Unexpected response from the API. An array of extensions was expected'
            } as IGenericError);
          }
          resolve(response.body as Array<{}>);
        })
        .catch((err: any) => {
          reject({ orgId: org.getId(), message: err } as IGenericError);
        });
    });
  }

  static loadEachExtension(org: Organization, response: RequestResponse) {
    const count = response.body.length;
    Logger.verbose(`${count} extension${count > 1 ? 's' : ''} from ${Colors.organization(org.getId())}`);
    return Promise.all(
      _.map(response.body, (extension: any) => {
        Assert.exists(extension['id'], StaticErrorMessage.MISSING_EXTENSION_ID_FROM_THE_RESPONSE);
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
              reject(err);
            });
        });
      })
    );
  }

  static addLoadedExtensionsToOrganization(org: Organization, rawExtension: IStringMap<any>) {
    const extension = new Extension(rawExtension);
    org.addExtension(extension);
  }
}
