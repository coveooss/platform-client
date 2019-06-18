import * as _ from 'underscore';
import * as fs from 'fs-extra';
import path = require('path');
import { IDownloadResultArray } from '../commons/collections/DownloadResultArray';
import { Colors } from '../commons/colors';
import { IGenericError, StaticErrorMessage } from '../commons/errors';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Logger } from '../commons/logger';
import { BaseController } from '../controllers/BaseController';
import { FieldController } from '../controllers/FieldController';
import { Field } from '../coveoObjects/Field';
import { Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';
import { Source } from '../coveoObjects/Source';

export class DownloadCommand {
  private organization: Organization;

  /**
   * Creates an instance of DownloadCommand.
   * @param {string} originOrganization
   * @param {string} originApiKey
   * @param {string} outputFolder
   * @memberof DownloadCommand
   */
  constructor(originOrganization: string, originApiKey: string, private outputFolder: string) {
    this.organization = new Organization(originOrganization, originApiKey);
  }

  /**
   * Downloads the fields of organization. Produces a ${objectName}.json file
   * @memberof DownloadCommand
   */
  downloadFields() {
    const fieldController: FieldController = new FieldController(this.organization);
    this.download(fieldController, 'Field', (field: Field) => field.getConfiguration());
  }

  /**
   * Downloads the sources of organization. Produces a ${objectName}.json file
   * @memberof DownloadCommand
   */
  downloadSources() {
    const sourceController: SourceController = new SourceController(this.organization);
    this.download(sourceController, 'Source', (source: Source) => source.getConfiguration());
  }

  /**
   * Downloads the extensions of organization. Produces a ${objectName}.json file
   * @memberof DownloadCommand
   */
  downloadExtensions() {
    // TODO: to implement
  }

  private download(controller: BaseController, objectName: string, extractionMethod: (object: any) => IStringMap<any>) {
    Logger.startSpinner(`Downloading ${objectName}s`);

    controller
      .download()
      .then((downloadResultArray: IDownloadResultArray) => {
        // sort the items in the list
        downloadResultArray.sort();

        // get the list
        const items = _.map(downloadResultArray.getItems(), item => extractionMethod(item));

        // ensure path
        fs.ensureDirSync(this.outputFolder);
        // prepare file name
        const filename = path.join(this.outputFolder, `${objectName.toLowerCase()}.json`);
        // save to file
        fs.writeJSON(filename, items, { spaces: 2 })
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
