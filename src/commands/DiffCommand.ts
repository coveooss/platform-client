import * as opn from 'opn';
import * as fs from 'fs-extra';
import { FieldController } from '../controllers/FieldController';
import { Organization } from '../coveoObjects/Organization';
import { Logger } from '../commons/logger';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { Field } from '../coveoObjects/Field';
import { IDiffOptions } from '../commons/utils/DiffUtils';
import * as _ from 'underscore';
import { ExtensionController } from '../controllers/ExtensionController';
import { Extension } from '../coveoObjects/Extension';
import { StaticErrorMessage } from '../commons/errors';

export class DiffCommand {
  private organization1: Organization;
  private organization2: Organization;
  private options: IDiffOptions;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    options?: IDiffOptions
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
  }

  static COMMAND_NAME: string = 'diff';

  private getFieldDiffDefaultOptions(): IDiffOptions {
    return { keysToIgnore: [] };
  }

  private getExtensionsDiffDefaultOptions(): IDiffOptions {
    return { includeOnly: ['name', 'content', 'description', 'enabled', 'requiredDataStreams'] };
  }

  public diff(): void {
  }
  // FIXME: Enable command to diff to objects without exiting the application first
  /**
   * Perform a "diff" over the organization fields
   */
  public diffFields() {
    let fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    Logger.startSpinner('Performing a field diff');
    fieldController.diff(this.options)
      .then((diffResultArray: DiffResultArray<Field>) => {
        fs.writeJSON('fieldDiff.json', fieldController.getCleanVersion(diffResultArray), { spaces: 2 })
          .then(() => {
            Logger.info('Diff operation completed');
            Logger.info('File saved as fieldDiff.json');
            Logger.stopSpinner();
            opn('fieldDiff.json');
            process.exit();
          }).catch((err: any) => {
            Logger.error('Unable to save setting file', err);
            Logger.stopSpinner();
            process.exit();
          });
      }).catch((err: any) => {
        Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
        Logger.stopSpinner();
        process.exit();
      });
  }

  /**
   * Perform a "diff" over the organization extensions
   */
  public diffExtensions() {
    let extensionController: ExtensionController = new ExtensionController(this.organization1, this.organization2);
    Logger.startSpinner('Performing an extension diff');
    extensionController.diff(this.options)
    // TODO: add getCleanVersion in extension controller
      .then((diffResultArray: DiffResultArray<Extension>) => {
        fs.writeJSON('extensionDiff.json', diffResultArray, { spaces: 2 })
          .then(() => {
            Logger.info('Diff operation completed');
            Logger.info('File saved as extensionDiff.json');
            Logger.stopSpinner();
            opn('extensionDiff.json');
            process.exit();
          }).catch((err: any) => {
            Logger.error('Unable to save setting file', err);
            Logger.stopSpinner();
            process.exit();
          });
      }).catch((err: any) => {
        Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, err);
        Logger.stopSpinner();
        process.exit();
      });
  }
}
