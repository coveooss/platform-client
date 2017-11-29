import { RequestResponse } from 'request';
import { RequestUtils } from '../utils/RequestUtils';
import { UrlService } from './UrlService';
import { Organization } from '../../coveoObjects/Organization';
import { Extension } from '../../coveoObjects/Extension';

export class ExtensionAPI {

  public static getAllExtensions(organization: Organization): Promise<RequestResponse> {
    return RequestUtils.get(
      UrlService.getExtensionsUrl(organization.getId()),
      organization.getApiKey()
    );
  }

  public static getSingleExtension(organization: Organization, extension: Extension) {
    return RequestUtils.get(
      UrlService.getSingleExtensionUrl(organization.getId(), extension.getId()),
      organization.getApiKey()
    );
  }

}
