import * as opn from 'opn';
import * as fs from 'fs-extra';
import * as _ from 'underscore';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { FieldController } from '../controllers/FieldController';
import { Organization } from '../coveoObjects/Organization';
import { Logger } from '../commons/logger';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { Field } from '../coveoObjects/Field';
import { ExtensionController } from '../controllers/ExtensionController';
import { Extension } from '../coveoObjects/Extension';
import { StaticErrorMessage, IGenericError } from '../commons/errors';
import { BaseController } from '../controllers/BaseController';

export interface IDiffOptions {
  /**
   * Specify which key to ignore during the Diff action. This is useful when a key always change from one Org to the other.
   * For instance id, createdDate, versionId, ...
   */
  keysToIgnore?: string[];
  /**
   * Specify which key to use for the Diff action. When defined, this option override the "keysToIgnore" option
   */
  includeOnly?: string[];
  /**
   * Prevent the diff result to be opened in a file once the operation has complete
   */
  silent?: boolean;
}

export class DiffCommand {
  private organization1: Organization;
  private organization2: Organization;

  constructor(originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
  }

  static DEFAULT_OPTIONS: IDiffOptions = {
    keysToIgnore: [],
    includeOnly: [],
    silent: false
  };

  static COMMAND_NAME: string = 'diff';

  /**
   * Diff the fields of both organizations passed in parameter
   *
   */
  public diffFields(options?: IDiffOptions) {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    this.diff(fieldController, 'Field', (fields: Field[]) => _.map(fields, (f: Field) => f.getFieldModel()), options);
  }

  /**
   * Diff the extensions of both organizations passed in parameter
   *
   */
  public diffExtensions(options?: IDiffOptions) {
    const extensionController: ExtensionController = new ExtensionController(this.organization1, this.organization2);
    this.diff(
      extensionController,
      'Extension',
      (extensions: Extension[]) => _.map(extensions, (e: Extension) => e.getExtensionModel()),
      options
    );
  }

  // FIXME: Enable command to diff to objects without exiting the application first
  /**
   * This is the generic 'diff' method
   *
   * @private
   * @param {BaseController} controller
   * @param {string} objectName
   * @param {(object: any[]) => any[]} extractionMethod
   * @param {IDiffOptions} options
   */
  private diff(controller: BaseController, objectName: string, extractionMethod: (object: any[]) => any[], opt?: IDiffOptions) {
    const options = _.extend(DiffCommand.DEFAULT_OPTIONS, opt) as IDiffOptions;

    Logger.startSpinner('Performing a field diff');

    // Give some info
    options.keysToIgnore
      ? Logger.verbose(`Diff will not be applied to the following keys: ${JSON.stringify(options.keysToIgnore)}`)
      : void 0;
    options.includeOnly
      ? Logger.verbose(`Diff will be applied exclusively to the following keys: ${JSON.stringify(options.includeOnly)}`)
      : void 0;

    controller
      .diff(options)
      .then((diffResultArray: DiffResultArray<BaseCoveoObject>) => {
        fs
          .writeJSON(`${objectName}Diff.json`, controller.getCleanVersion(diffResultArray, extractionMethod), { spaces: 2 })
          .then(() => {
            Logger.info('Diff operation completed');
            Logger.info(`File saved as ${objectName}Diff.json`);
            Logger.stopSpinner();
            if (!options.silent) {
              opn(`${objectName}Diff.json`);
            }
            process.exit();
          })
          .catch((err: any) => {
            Logger.error('Unable to save setting file', err);
            Logger.stopSpinner();
            process.exit();
          });
      })
      .catch((err: IGenericError) => {
        Logger.error(StaticErrorMessage.UNABLE_TO_DIFF);
        Logger.stopSpinner();
        process.exit();
      });
  }
}
