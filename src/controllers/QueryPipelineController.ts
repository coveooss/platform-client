// External packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject'
import { IOrganization } from '../commons/interfaces/IOrganization'
import { QueryPipeline } from '../models/QueryPipelineModel';
import { UrlService } from '../commons/services/UrlService';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { RequestUtils } from '../commons/utils/RequestUtils';

export class QueryPipelineController {
    constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

        try {
            // Load the configuration of the organizations
            let organizations: Array<IOrganization> = [organization1, organization2];
            let context: QueryPipelineController = this;

            organizations.forEach(function (organization: IOrganization) {
                context.loadQueryPipelines(organization);
            });

            // Diff the pipelines in terms of "existence"
            diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.QueryPipelines.Clone(), organization2.QueryPipelines.Clone());

            diffResultsExistence.UPDATED_NEW.Clear();

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

    public getQueryPipelines(organization: IOrganization): RequestResponse {
        return RequestUtils.getRequestAndReturnJson(
            UrlService.getQueryPipelinesUrl(organization.Id),
            organization.ApiKey
        );
    }

    public loadQueryPipelines(organization: IOrganization): void {
        let queryPipelines: any = this.getQueryPipelines(organization);
        queryPipelines.forEach(function (pipeline: any) {
            organization.QueryPipelines.Add(
                pipeline['name'],
                new QueryPipeline(
                    pipeline['name'],
                    pipeline
                )
            );
        });
    }
}
