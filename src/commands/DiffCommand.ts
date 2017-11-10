import { FieldController } from '../controllers/FieldController';
import { Organization } from '../models/OrganizationModel';
import { Logger } from '../commons/logger';
import { DiffResultArray } from '../models/DiffResultArray';
import { Field } from '../models/FieldModel';
import * as opn from 'opn';
import * as fs from 'fs-extra';

export class DiffCommand {
  private organization1: Organization;
  private organization2: Organization;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
  }

  static COMMAND_NAME: string = 'diff';

  public diff(): void {
  }

  /**
   * Perform a "diff" over the organization fields
   */
  public diffFields() {
    let fieldController: FieldController = new FieldController();
    fieldController.diff(this.organization1, this.organization2, ['stemming'])
      .then((diffResult: DiffResultArray<Field>) => {
        fs.writeJSON('fieldDiff.json', diffResult, { spaces: 2 })
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
