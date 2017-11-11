// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { SecurityProvider } from '../models/SecurityProviderModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
// // import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class SecurityProviderController {
    constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

        try {
        // Load the configuration of the organizations
        let organizations: Array<IOrganization> = [organization1, organization2];
        let context: SecurityProviderController = this;

        organizations.forEach(function (organization: IOrganization) {
            context.loadSecurityProviders(organization);
        });

        // Diff the security providers in terms of "existence"
        diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.SecurityProviders.Clone(), organization2.SecurityProviders.Clone());

        // Diff the security providers that could have been changed
        diffResultsExistence.UPDATED.Keys().forEach(function (key: string) {
            let securityProviderDiff: IDiffResult<any>  = new DiffResult<any>();

            securityProviderDiff = DiffUtils.diff(organization1.SecurityProviders.Item(key).Configuration, organization2.SecurityProviders.Item(key).Configuration, fieldsToIgnore);

            if (securityProviderDiff.ContainsItems()) {
                diffResults.Add(key, securityProviderDiff);
            }

            diffResultsExistence.UPDATED.Remove(key);
        });

        // Add the result if it still contains items
        if (diffResultsExistence.ContainsItems()) {
            diffResults.Add('ADD_DELETE', diffResultsExistence);
        }
        } catch (err) {
        // TODO: Move the loogers from all files to their base classes when possible
        // Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

        throw err;
        }

        return diffResults;
    }

    public getSecurityProviders(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getSecurityProvidersUrl(organization.Id),
            organization.ApiKey
        );
    }

    public getSingleSecurityProvider(organization: IOrganization, securityProviderId: string): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getSingleSecurityProviderUrl(organization.Id, securityProviderId),
            organization.ApiKey
        );
    }

    public loadSecurityProviders(organization: IOrganization): void {
        let securityProviders: any = this.getSecurityProviders(organization);
        let context = this;
        securityProviders.forEach(function (securityProvider: any) {
            organization.SecurityProviders.Add(
                securityProvider['name'],
                new SecurityProvider(
                    securityProvider['id'],
                    context.getSingleSecurityProvider(organization, securityProvider['id'])
                )
            );
        });
    }
}
