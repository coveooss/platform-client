// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class SearchApiAuthenticationController {
    constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

        try {
            // Load the configuration of the organizations
            let organizations: Array<IOrganization> = [organization1, organization2];
            let context: SearchApiAuthenticationController = this;

            organizations.forEach(function (organization: IOrganization) {
                context.loadSearchApiAuthentications(organization);
            });

            // Diff the authentications in terms of "existence"
            diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Authentications.Clone(), organization2.Authentications.Clone());

            // Diff the authentications that could have been changed
            diffResultsExistence.UPDATED_NEW.Keys().forEach(function (key: string) {
                let authenticationDiff = DiffUtils.diff(
                    organization1.Authentications.Item(key).Configuration,
                    organization2.Authentications.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (authenticationDiff.ContainsItems()) {
                    diffResults.Add(key, authenticationDiff);
                }

                diffResultsExistence.UPDATED_NEW.Remove(key);
            });

            // Add the result if it still contains items
            if (diffResultsExistence.ContainsItems()) {
                diffResults.Add('ADD_DELETE', diffResultsExistence);
            }
            } catch (err) {
            // TODO: Move the loogers from all files to their base classes when possible
            Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

            throw err;
        }

        return diffResults;
    }

    public getSearchApiAuthentications(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getSearchApiAuthenticationsUrl(organization.Id),
            organization.ApiKey
        );
    }

    public loadSearchApiAuthentications(organization: IOrganization): void {
        let authentications: any = this.getSearchApiAuthentications(organization);
        authentications.forEach(function (authentication: any) {
            organization.Authentications.Add(
                authentication['name'],
                authentication
            );
        });
    }
}
