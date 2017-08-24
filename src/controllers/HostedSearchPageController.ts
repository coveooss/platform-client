// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { HostedSearchPage } from '../models/HostedSearchPageModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class HostedSearchPagesController {
    constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

        try {
            // Load the configuration of the organizations
            let organizations: Array<IOrganization> = [organization1, organization2];
            let context: HostedSearchPagesController = this;

            organizations.forEach(function (organization: IOrganization) {
                context.loadHostedSearchPages(organization);
            });

            // Diff the hosted search pages in terms of "existence"
            diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.HostedSearchPages.Clone(), organization2.HostedSearchPages.Clone());

            // Diff the hosted search pages that could have been changed
            diffResultsExistence.UPDATED_NEW.Keys().forEach(function (key: string) {
                let hostedSearchPageDiff = DiffUtils.diff(
                    organization1.HostedSearchPages.Item(key).Configuration,
                    organization2.HostedSearchPages.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (hostedSearchPageDiff.ContainsItems()) {
                    diffResults.Add(key, hostedSearchPageDiff);
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

    public getHostedSearchPages(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getHostedSearchPagesUrl(organization.Id),
            organization.ApiKey
        );
    }

    public loadHostedSearchPages(organization: IOrganization): void {
        let searchPages: any = this.getHostedSearchPages(organization);
        searchPages.forEach(function (searchPage: any) {
            organization.HostedSearchPages.Add(
                searchPage['name'],
                new HostedSearchPage (
                    searchPage['name'],
                    searchPage
                )
            );
        });
    }
}
