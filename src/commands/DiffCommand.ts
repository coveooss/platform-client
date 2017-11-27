import * as opn from 'opn';
import * as fs from 'fs-extra';
import { FieldController } from '../controllers/FieldController';
import { Organization } from '../coveoObjects/Organization';
import { Logger } from '../commons/logger';
import { DiffResultArray } from '../coveoObjects/DiffResultArray';
import { Field } from '../coveoObjects/Field';
import { IDiffOptions } from '../commons/utils/DiffUtils';
import * as _ from 'underscore';

export interface IDiffOptions {
  force: boolean;
}

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
    this.options = _.extend(DiffCommand.DEFAULT_OPTIONS, options);
  }

  static DEFAULT_OPTIONS: IDiffOptions = {
    fieldsToIgnore: []
  };

  static COMMAND_NAME: string = 'diff';

  public diff(): void {
  }

  /**
   * Perform a "diff" over the organization fields
   */
  public diffFields() {
    let fieldController: FieldController = new FieldController(this.organization1, this.organization2);
    fieldController.diff(this.options)
      .then((diffResultArray: DiffResultArray<Field>) => {
        fs.writeJSON('fieldDiff.json', diffResultArray, { spaces: 2 })
          .then(() => {
            Logger.info('File saved as fieldDiff.json');
            opn('fieldDiff.json');
            process.exit();
          }).catch((err: any) => {
            Logger.error('Unable to save setting file', err);
          });
      });
  }
}
