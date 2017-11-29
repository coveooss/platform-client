import { RequestResponse } from 'request';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { Organization } from '../../coveoObjects/Organization';
import { Extension } from '../../coveoObjects/Extension';
import { IStringMap } from '../interfaces/IStringMap';
import { Assert } from '../misc/Assert';
import { Logger } from '../logger';
import * as _ from 'underscore';
import { StaticErrorMessage } from '../errors';

export class ExtensionAPI {

  public static getAllExtensions(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(
      UrlService.getExtensionsUrl(organization.getId()),
      organization.getApiKey()
    );
  }

  public static getSingleExtension(organization: Organization, extensionId: string) {
    Assert.isNotUndefined(extensionId, 'Cannot load undefined extension');
    return RequestUtils.get(
      UrlService.getSingleExtensionUrl(organization.getId(), extensionId),
      organization.getApiKey()
    );
  }

  public static loadExtensions(org: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {
      // Load all extensions
      this.getAllExtensions(org)
        .then((response: RequestResponse) => {
          // Load each extension
          Promise.all(_.map(response.body, (extension: any) => {
            Logger.verbose(`Loading "${extension['name']}" extension from ${org.getId()}`);
            this.getSingleExtension(org, extension['id'])
              .then((extensionBody: RequestResponse) => {
                // TODO: add this function add this function as a callback since it doesn't make sense to put it in the API
                this.addLoadedExtensionsToOrganization(org, extensionBody.body);
              }).catch((err: any) => {
                Logger.error(StaticErrorMessage.UNABLE_TO_LOAD_SINGLE_EXTENTION + ` "${extension['name']}"`, err);
                reject(err);
              });
          }));
        }).catch((err: any) => {
          reject(err);
        });
    });
  }

  public static addLoadedExtensionsToOrganization(org: Organization, rawExtension: IStringMap<any>) {
    let extension = new Extension(rawExtension['id'], rawExtension);
    org.getExtensions().add(extension.getName(), extension);
  }
}
