import * as fs from 'fs-extra';
import _ = require('underscore');
import path = require('path');
import { BaseController } from '../controllers/BaseController';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { DownloadResultArray, IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { FieldController } from '../controllers/FieldController';
import { Logger } from '../commons/logger';
import { Organization } from '../coveoObjects/Organization';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { Field } from '../coveoObjects/Field';
import { IStringMap } from '../commons/interfaces/IStringMap';

export class DownloadCommand {
  private oganization: Organization;

  /**
   * Creates an instance of DownloadCommand.
   * @param {string} originOrganization
   * @param {string} originApiKey
   * @param {string} outputFolder
   * @memberof DownloadCommand
   */
  constructor(private originOrganization: string, originApiKey: string, private outputFolder: string) {
    this.oganization = new Organization(originOrganization, originApiKey);
  }

  /**
   * Downloads the fields of organization. Produces a ${objectName}.json file
   * @memberof DownloadCommand
   */
  public downloadFields() {
    // hack: FieldController needs 2 orgs becaase initially it was  meant for comparison. Feed it.
    const dummyOrg = new Organization('dummy', 'dummy');
    const fieldController: FieldController = new FieldController(this.oganization, dummyOrg);
    this.download(fieldController, 'Field', (field: Field) => field.getFieldModel());
  }

  private download(controller: BaseController, objectName: string, extractionMethod: (object: any) => IStringMap<any>) {
    Logger.startSpinner('Downloading fields');

    controller
      .download(this.originOrganization)
      .then((downloadResultArray: IDownloadResultArray) => {
        // sort the items in the list
        downloadResultArray.sort();
        // get the list
        const items = downloadResultArray.getItems();
        // sort items' attributes
        items.forEach((value: BaseCoveoObject, index: number, array: BaseCoveoObject[]) => {
          array[index] = JsonUtils.sortObjectProperties(extractionMethod(value), true);
        });
        // ensure path
        fs.ensureDirSync(this.outputFolder);
        // prepare file name
        const filename = path.join(this.outputFolder, `${objectName.toLowerCase()}.json`);
        // save to file
        fs
          .writeJSON(filename, items, { spaces: 2 })
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
