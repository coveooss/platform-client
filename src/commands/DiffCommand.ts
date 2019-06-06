import * as fs from 'fs-extra';
import opn = require('opn');
import * as _ from 'underscore';
import { DiffResultArray } from '../commons/collections/DiffResultArray';
import { Colors } from '../commons/colors';
import { StaticErrorMessage } from '../commons/errors';
import { Logger } from '../commons/logger';
import { BaseController } from '../controllers/BaseController';
import { ExtensionController } from '../controllers/ExtensionController';
import { FieldController } from '../controllers/FieldController';
import { SourceController } from '../controllers/SourceController';
import { BaseCoveoObject } from '../coveoObjects/BaseCoveoObject';
import { Organization, IBlacklistObjects } from '../coveoObjects/Organization';
import { EnvironmentUtils } from '../commons/utils/EnvironmentUtils';

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
  /**
   * Specify the sources from which to load the data
   */
  sources?: string[];
}

export class DiffCommand {
  private organization1: Organization;
  private organization2: Organization;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
    blacklistObjects?: IBlacklistObjects
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey, blacklistObjects);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey, blacklistObjects);
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
  diffFields(options?: IDiffOptions) {
    const fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    this.diff(fieldController, 'Field', options);
  }

  /**
   * Diff the extensions of both organizations passed in parameter
   *
   */
  diffExtensions(options?: IDiffOptions) {
    const extensionController: ExtensionController = new ExtensionController(this.organization1, this.organization2);
    this.diff(extensionController, 'Extension', options);
  }

  /**
   * Diff the sources of both organizations passed in parameter
   *
   */
  diffSources(options?: IDiffOptions) {
    const sourceController: SourceController = new SourceController(this.organization1, this.organization2);
    this.diff(sourceController, 'Source', options);
  }

  // FIXME: Enable command to diff to objects without exiting the application first
  /**
   * This is the generic 'diff' method
   *
   * @private
   * @param {BaseController} controller
   * @param {string} objectName
   * @param {IDiffOptions} options
   */
  private diff(controller: BaseController, objectName: string, opt?: IDiffOptions) {
    objectName = objectName.toLowerCase();
    const options = _.extend(DiffCommand.DEFAULT_OPTIONS, opt) as IDiffOptions;

    Logger.startSpinner('Performing a field diff');

    // Give some useful information
    options.includeOnly && options.includeOnly.length > 0
      ? Logger.verbose(`Diff will be applied exclusively to the following keys: ${JSON.stringify(options.includeOnly)}`)
      : options.keysToIgnore
      ? Logger.verbose(`Diff will not be applied to the following keys: ${JSON.stringify(options.keysToIgnore)}`)
      : void 0;

    controller
      .diff(options)
      .then((diffResultArray: DiffResultArray<BaseCoveoObject>) => {
        Logger.info(`objectName: ${objectName}`);
        if (objectName === 'source') {
          Logger.info('Preparing HTML diff file');

          const cleanVersion = controller.getCleanVersion(diffResultArray, options);

          const newSources = JSON.stringify(cleanVersion.TO_CREATE);
          const deletedSources = JSON.stringify(cleanVersion.TO_DELETE);
          const cleanDiff = JSON.stringify(cleanVersion.TO_UPDATE);

          const viewPath = EnvironmentUtils.isTestRunning() ? `../../views/source-diff.ejs` : `views/source-diff.ejs`;

          fs.readFile(viewPath, (err, data) => {
            Logger.info('Reading file');
            if (err) {
              Logger.error('Unable to read html file', err);
              return;
            }

            // FIXME: That's very sketchy. Ideally we want to use an ejs loader.
            const htmlContent = data
              .toString()
              .replace('DIFF_OBJECT', cleanDiff)
              .replace('SOURCES_TO_CREATE', newSources)
              .replace('SOURCES_TO_DELETE', deletedSources);

            fs.writeFile(`${objectName}Diff.html`, htmlContent)
              .then(() => {
                Logger.info('Diff operation completed');
                Logger.info(`File saved as ${Colors.filename(objectName + 'Diff.json')}`);
                Logger.stopSpinner();
                if (!options.silent) {
                  opn(`${objectName}Diff.html`);
                }
                process.exit();
              })
              .catch((error: any) => {
                Logger.error('Unable to create html file', error);
                Logger.stopSpinner();
                process.exit();
              });
          });
        } else {
          fs.writeJSON(`${objectName}Diff.json`, controller.getCleanVersion(diffResultArray, options), { spaces: 2 })
            .then(() => {
              // TODO: do the same for every object types
              Logger.info('Diff operation completed');
              Logger.info(`File saved as ${Colors.filename(objectName + 'Diff.json')}`);
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
        }
      })
      .catch((err: any) => {
        Logger.logOnly(StaticErrorMessage.UNABLE_TO_DIFF, err);
        Logger.error(StaticErrorMessage.UNABLE_TO_DIFF, 'Consult the logs for more information');
        Logger.stopSpinner();
        process.exit();
      });
  }
}
