// External Packages
import { RequestResponse } from 'request';
// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Field } from '../models/FieldModel';
import { UrlService } from '../commons/services/UrlService';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';

export class FieldController {
  constructor() { }

    public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
        let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
        let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

        try {
            // Load the configuration of the organizations
            let organizations: Array<IOrganization> = [organization1, organization2];
            let context: FieldController = this;
            organizations.forEach(function (organization: IOrganization) {
                context.loadFields(organization);
            });
            // Diff the fields in terms of "existence"
            diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Fields.Clone(), organization2.Fields.Clone());
            // Diff the fields that could have been changed
            diffResultsExistence.UPDATED.Keys().forEach(function (key: string) {
                let fieldDiff = DiffUtils.diff(
                    organization1.Fields.Item(key).Configuration,
                    organization2.Fields.Item(key).Configuration,
                    fieldsToIgnore
                )

                if (fieldDiff.ContainsItems()) {
                    diffResults.Add(key, fieldDiff);
                }

                diffResultsExistence.UPDATED.Remove(key);
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

    public getFieldsPage(organization: IOrganization, page: number): RequestResponse {
      return RequestUtils.getRequestAndReturnJson(
          UrlService.getFieldsPageUrl(organization.Id, page),
          organization.ApiKey
      );
    }

    public loadFields(organization: IOrganization): void {
      // TODO: Obtenir tous les fields.
      let currentPage: number = 0;
      let totalPages: number = 0;

      do {
        let jsonResponse: any = this.getFieldsPage(organization, currentPage)

        jsonResponse['items'].forEach(function (field: any) {
          organization.Fields.Add(
            field['name'],
            new Field (
              field['name'],
              field
            )
          )
        });

        totalPages = Number(jsonResponse['totalPages']);
        currentPage++;
      } while (currentPage < totalPages);
    }
}
