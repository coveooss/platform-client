import { RequestResponse } from 'request';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Field } from '../models/FieldModel';
import { UrlService } from '../commons/services/UrlService';
import { RequestUtils } from '../commons/utils/RequestUtils';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import { DiffResult } from '../models/DiffResult';
import { Logger } from '../commons/logger';
import { Dictionary } from '../commons/collections/Dictionary';
import { StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Organization } from '../models/OrganizationModel';
import * as _ from 'underscore';
import * as request from 'request';
import { ArrayUtils } from '../commons/utils/ArrayUtils';

export class FieldController {

  /**
   * To prevent having too large fields batches that can't be processed.
   * The Maximum allowed number of fields is 500.
   */
  private fieldsPerBatch: number = 500;

  constructor() { }

  /**
   * Perform a diff and return the result that will be used for the graduate command
   *
   * @param {Organization} organization1 Origin Organisation
   * @param {Organization} organization2 Final Organisation
   * @returns {IDiffResult<string>} The Diff result
   * @memberof FieldController
   */
  public graduate(organization1: Organization, organization2: Organization) {
    Logger.info('Graduating fields')

    Promise.all([this.loadFields(organization1), this.loadFields(organization2)])
      .then(() => {
        let diffResult = DiffUtils.getDiffResult(organization1.Fields, organization2.Fields);

        // TODO: make async
        this.createFields(organization2, this.getFieldModels(diffResult.NEW));
        this.updateFields(organization2, this.getFieldModels(diffResult.UPDATED));
        // this.deleteFields(organization2, this.getFieldModels(diffResult.DELETED));

      }).catch((err: any) => {

      })

    // return response and summary
  }

  public createFields(org: Organization, fieldModels: IStringMap<string>[]) {
    if (fieldModels.length === 0) {
      return;
    }
    let url = UrlService.createFields(org.Id);
    _.each(ArrayUtils.chunkArray(fieldModels, this.fieldsPerBatch), (batch: IStringMap<string>[]) => {
      RequestUtils.post(url, org.ApiKey, fieldModels);
    })
  }

  public updateFields(org: Organization, fieldModels: IStringMap<string>[]) {
    if (fieldModels.length === 0) {
      return;
    }
    let url = UrlService.updateFields(org.Id);
    _.each(ArrayUtils.chunkArray(fieldModels, this.fieldsPerBatch), (batch: IStringMap<string>[]) => {
      RequestUtils.put(url, org.ApiKey, fieldModels);
    })
  }

  public deleteFields(org: Organization, fieldModels: IStringMap<string>[]) {
    // TODO
  }

  public getFieldModels(fields: Field[]): IStringMap<string>[] {
    return _.pluck(fields, 'fieldModel');
  }

  public diff(organization1: Organization, organization2: Organization, fieldsToIgnore: Array<string>): Dictionary<IDiffResult<any>> {
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();
    let diffResultsExistence: DiffResult<string> = new DiffResult<string>();

    try {
      // Load the configuration of the organizations
      let organizations: Array<Organization> = [organization1, organization2];
      let context: FieldController = this;
      organizations.forEach(function (organization: Organization) {
        context.loadFieldsSync(organization);
      });
      // Diff the fields in terms of "existence"
      diffResultsExistence = DiffUtils.diffDictionaryEntries(organization1.Fields.Clone(), organization2.Fields.Clone());
      // Diff the fields that could have been changed
      diffResultsExistence.UPDATED.Keys().forEach(function (key: string) {
        let fieldDiff = DiffUtils.diff(
          organization1.Fields.Item(key).fieldModel,
          organization2.Fields.Item(key).fieldModel,
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

  public getFieldsPageSync(organization: Organization, page: number): RequestResponse {
    return RequestUtils.getRequestAndReturnJson(
      UrlService.getFieldsPageUrl(organization.Id, page),
      organization.ApiKey
    );
  }

  public loadFieldsSync(organization: Organization): void {
    let currentPage: number = 0;
    let totalPages: number = 0;

    do {
      let jsonResponse: any = this.getFieldsPageSync(organization, currentPage)

      jsonResponse['items'].forEach((f: IStringMap<string>) => {
        let field = new Field(f);
        organization.Fields.Add(field.name, field)
      });

      totalPages = Number(jsonResponse['totalPages']);
      currentPage++;
    } while (currentPage < totalPages);
  }

  public getFieldsPage(organization: Organization, page: number): Promise<RequestResponse> {
    // TODO: add loading bar here!
    return RequestUtils.get(
      UrlService.getFieldsPageUrl(organization.Id, page),
      organization.ApiKey
    );
  }

  public loadFields(organization: Organization): Promise<{}> {
    // tslint:disable-next-line:typedef
    return new Promise((resolve, reject) => {

      this.getFieldsPage(organization, 0)
        .then((response: RequestResponse) => {
          Logger.debug(`Done loading first page fields from ${organization.Id}`);
          this.addLoadedFieldsToORganization(organization, response.body.items);
          Logger.debug('Adding loaded fields to organization');

          if (response.body.totalPages > 1) {
            this.loadOtherPages(organization, response.body.totalPages)
              .then(() => resolve())
              .catch((err: any) => {
                Logger.error(StaticErrorMessage.UNABLE_TO_LOAD_OTHER_FIELDS);
                reject(err)
              });
          } else {
            resolve();
          }

        }).catch((err: any) => {
          Logger.error(StaticErrorMessage.UNABLE_TO_LOAD_FIELDS);
          reject(err);
        })
    })
  }

  public loadOtherPages(organization: Organization, totalPages: number): Promise<void> {
    Logger.debug(`Loading ${totalPages} pages of fields from ${organization.Id}.`);
    let pageArray = _.map(new Array(totalPages - 1), (v: number, idx: number) => idx + 1);
    return Promise
      .all(_.map(pageArray, (page: number) => this.getFieldsPage(organization, page)))
      .then((otherPages: RequestResponse[]) => {
        _.each(otherPages, (response: RequestResponse) => {
          this.addLoadedFieldsToORganization(organization, response.body.items);
        })
      })
  }

  public addLoadedFieldsToORganization(organization: Organization, fields: IStringMap<string>[]) {
    fields.forEach((f: IStringMap<string>) => {
      let field = new Field(f);
      organization.Fields.Add(field.name, field)
    });
  }

}
