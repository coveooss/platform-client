// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { CustomDimension } from '../models/CustomDimensionModel';
import { NamedFilter } from '../models/NamedFilterModel';
import { Report } from '../models/ReportModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class UsageAnalyticsController {
    constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistenceCustomDimensions: DiffResult<string> = new DiffResult<string>();
        let diffResultsExistenceNamedFilters: DiffResult<string> = new DiffResult<string>();
        let diffResultsExistenceReports: DiffResult<string> = new DiffResult<string>();

        try {
            // Load the configuration of the organizations
            let organizations: Array<IOrganization> = [organization1, organization2];
            let context: UsageAnalyticsController = this;
            organizations.forEach(function (organization: IOrganization) {
                context.loadCustomDimensions(organization);
                context.loadNamedFilters(organization);
                context.loadReports(organization);
            });

            // Diff the items in terms of "existence"
            diffResultsExistenceCustomDimensions = DiffUtils.diffDictionaryEntries(organization1.CustomDimensions.Clone(), organization2.CustomDimensions.Clone());
            diffResultsExistenceNamedFilters = DiffUtils.diffDictionaryEntries(organization1.NamedFilters.Clone(), organization2.NamedFilters.Clone());
            diffResultsExistenceReports = DiffUtils.diffDictionaryEntries(organization1.Reports.Clone(), organization2.Reports.Clone());
            // Diff the items that could have been changed for the dimensions
            diffResultsExistenceCustomDimensions.UPDATED_NEW.Keys().forEach(function (key: string) {
                let customDimensionDiff = DiffUtils.diff(
                    organization1.CustomDimensions.Item(key).Configuration,
                    organization2.CustomDimensions.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (customDimensionDiff.ContainsItems()) {
                    diffResults.Add('CustomDimension::' + key, customDimensionDiff);
                }

                diffResultsExistenceCustomDimensions.UPDATED_NEW.Remove(key);
            });
            // Diff the items that could have been changed for the dimensions
            diffResultsExistenceNamedFilters.UPDATED_NEW.Keys().forEach(function (key: string) {
                let namedFilterDiff = DiffUtils.diff(
                    organization1.NamedFilters.Item(key).Configuration,
                    organization2.NamedFilters.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (namedFilterDiff.ContainsItems()) {
                    diffResults.Add('NamedFilter::' + key, namedFilterDiff);
                }

                diffResultsExistenceNamedFilters.UPDATED_NEW.Remove(key);
            });
            // Diff the items that could have been changed for the dimensions
            diffResultsExistenceReports.UPDATED_NEW.Keys().forEach(function (key: string) {
                let reportDiff = DiffUtils.diff(
                    organization1.Reports.Item(key).Configuration,
                    organization2.Reports.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (reportDiff.ContainsItems()) {
                    diffResults.Add('Report::' + key, reportDiff);
                }

                diffResultsExistenceCustomDimensions.UPDATED_NEW.Remove(key);
            });

            // Add the existence results if it still contains items
            if (diffResultsExistenceCustomDimensions.ContainsItems()) {
                diffResults.Add('ADD_DELETE_CUSTOM_DIMENSIONS', diffResultsExistenceCustomDimensions);
            }
            if (diffResultsExistenceNamedFilters.ContainsItems()) {
                diffResults.Add('ADD_DELETE_NAMED_FILTERS', diffResultsExistenceNamedFilters);
            }
            if (diffResultsExistenceReports.ContainsItems()) {
                diffResults.Add('ADD_DELETE', diffResultsExistenceReports);
            }
        } catch (err) {
            // TODO: Move the loogers from all files to their base classes when possible
            Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);

            throw err;
        }

        return diffResults;
    }

    public getCustomDimensions(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getCustomDimensionsUrl(organization.Id),
            organization.ApiKey
        );
    }

    public getNamedFilters(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getNamedFiltersUrl(organization.Id),
            organization.ApiKey
        );
    }

    public getReports(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getReportsUrl(organization.Id),
            organization.ApiKey
        );
    }

    public loadCustomDimensions(organization: IOrganization): void {
        // Dimensions
        let customDimensions: any = this.getCustomDimensions(organization);
        customDimensions.forEach(function (customDimension: any) {
            organization.CustomDimensions.Add(
                customDimension['returnName'],
                new CustomDimension(
                    customDimension['returnName'],
                    customDimension
                )
            );
        });
    }

    public loadNamedFilters(organization: IOrganization): void {
        // Filters
        let namedFilters: any = this.getNamedFilters(organization);
        namedFilters['filters'].forEach(function (namedFilter: any) {
            organization.NamedFilters.Add(
                namedFilter['id'],
                new NamedFilter(
                    namedFilter['id'],
                    namedFilter
                )
            );
        });
    }

    public loadReports(organization: IOrganization): void {
        // Reports
        let reports: any = this.getReports(organization);
        reports['reports'].forEach(function (report: any) {
            organization.Reports.Add(
                report['displayName'],
                new NamedFilter(
                    report['id'],
                    report
                )
            );
        });
    }
}
