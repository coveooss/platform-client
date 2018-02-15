import * as fs from 'fs-extra';
import _ = require('underscore');
import { BaseController } from '../controllers/BaseController';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { DownloadResultArray } from '../commons/collections/DownloadResultArray';
import { FieldController } from '../controllers/FieldController';
import { Logger } from '../commons/logger';
import { Organization } from '../coveoObjects/Organization';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';

export interface IDownloadOptions {
  dummy: string;
}
export class DownloadCommand {
  private organization1: Organization;
  private organization2: Organization;

  static DEFAULT_OPTIONS: IDownloadOptions = {
    dummy: 'string'
  };

  constructor(originOrganization: string, originApiKey: string) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization('dummy', 'dummy');
  }

  public downloadFields(options?: IDownloadOptions) {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    fieldController.download();
    this.download(fieldController, 'Field', options);
  }

  private download(controller: BaseController, objectName: string, opt?: IDownloadOptions) {
    objectName = objectName.toLowerCase();
    const options = _.extend(DownloadCommand.DEFAULT_OPTIONS, opt) as IDownloadOptions;

    Logger.startSpinner('Downloading fields');

    controller
      .download(options)
      .then((downloadResultArray: DownloadResultArray<BaseCoveoObject>) => {
        downloadResultArray.ITEMS.forEach((value: BaseCoveoObject, index: number, array: BaseCoveoObject[]) => {
          array[index] = JsonUtils.sortObjectProperties(value, true);
        });
        const filename: string = `${objectName}Download.json`;
        fs
          .writeJSON(filename, downloadResultArray.ITEMS, { spaces: 2 })
          .then(() => {
            Logger.info('Download operation completed');
            Logger.info(`File saved as ${Colors.filename(filename)}`);
            Logger.stopSpinner();
            process.exit();
          })
          .catch((err: any) => {
            Logger.error('Unable to save download file', err);
            Logger.stopSpinner();
            process.exit();
          });
      })
      .catch((err: IGenericError) => {
        Logger.error(StaticErrorMessage.UNABLE_TO_DOWNLOAD);
        Logger.stopSpinner();
        process.exit();
      });
  }
}
