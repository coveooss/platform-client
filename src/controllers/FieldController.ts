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
import * as _ from 'underscore';
import { IStringMap } from '../commons/interfaces/IStringMap';
import * as request from 'request';

export class FieldController {
  constructor() { }

  /**
   * Perform a diff and return the result that will be used for the graduate command
   *
   * @param {IOrganization} organization1 Origin Organisation
   * @param {IOrganization} organization2 Final Organisation
   * @returns {IDiffResult<string>} The Diff result
   * @memberof FieldController
   */
  public graduate(organization1: IOrganization, organization2: IOrganization) {
    Logger.info('Graduating fields')

    // Make async so we can load fields of both orgs at the same time
    this.loadFieldsSync(organization1);
    this.loadFieldsSync(organization2);

    let diffResult = DiffUtils.getDiffResult(
      <Dictionary<Field>>organization1.Fields.Clone(),
      <Dictionary<Field>>organization2.Fields.Clone()
    );

    console.log('*********************');
    console.log(diffResult);
    console.log('*********************');

    // TODO: make async
    // this.deleteFields(organization2, this.getFieldModels(diffResult.DELETED));
    // this.createFields(organization2, this.getFieldModels(diffResult.NEW));
    // this.updateFields(organization2, this.getFieldModels(diffResult.UPDATED));

    // return response and summary
  }

  public createFields(org: IOrganization, fieldModels: IStringMap<string>[]): number {
    if (fieldModels.length === 0) {
      return 0;
    }
    let url = UrlService.createFields(org.Id);
    RequestUtils.post(url, org.ApiKey, fieldModels);
    return fieldModels.length;
  }

  public updateFields(org: IOrganization, fieldModels: IStringMap<string>[]) {
    if (fieldModels.length === 0) {
      return 0;
    }
    let url = UrlService.updateFields(org.Id);
    RequestUtils.put(url, org.ApiKey, fieldModels);
    return fieldModels.length;
  }

  public deleteFields(org: IOrganization, fieldModels: IStringMap<string>[]) {
    // TODO
  }

  public getFieldModels(fields: Field[]): IStringMap<string>[] {
    let payload: IStringMap<string>[] = [];
    _.each(fields, (field: Field) => {
      payload.push(field.Configuration);
    })
    return payload;
  }

  public diff(organization1: IOrganization, organization2: IOrganization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
    let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

    try {
      // Load the configuration of the organizations
      let organizations: Array<IOrganization> = [organization1, organization2];
      let context: FieldController = this;
      organizations.forEach(function (organization: IOrganization) {
        context.loadFieldsSync(organization);
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

  public getFieldsPage(organization: IOrganization, page: number): Promise<RequestResponse> {
    return RequestUtils.get(
      UrlService.getFieldsPageUrl(organization.Id, page),
      organization.ApiKey
    );
  }

  public getFieldsPageSync(organization: IOrganization, page: number): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getFieldsPageUrl(organization.Id, page),
      organization.ApiKey
    );
  }

  public loadFieldsSync(organization: IOrganization): void {
    let currentPage: number = 0;
    let totalPages: number = 0;

    do {
      let jsonResponse: any = this.getFieldsPageSync(organization, currentPage)

      jsonResponse['items'].forEach(function (field: any) {
        organization.Fields.Add(
          field['name'],
          new Field(
            field['name'],
            field
          )
        )
      });

      totalPages = Number(jsonResponse['totalPages']);
      currentPage++;
    } while (currentPage < totalPages);
  }

  public loadFields(organization: IOrganization): void {
    let currentPage: number = 0;
    let totalPages: number = 0;

    do {
      // TODO: make async
      let jsonResponse: any = this.getFieldsPageSync(organization, currentPage)

      jsonResponse['items'].forEach(function (field: any) {
        organization.Fields.Add(
          field['name'],
          new Field(
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
