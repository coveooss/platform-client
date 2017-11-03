// External packages
import * as opn from 'opn';
// Internal packages
import { BaseCommand } from './BaseCommand';
import { ICommand } from '../commons/interfaces/ICommand';
import { DiffResultsPageHtmlTemplate, DiffResultsItemTemplate } from '../commons/templates/diff-results-template';
import { FileUtils } from '../commons/utils/FileUtils';
import { Dictionary } from '../commons/collections/Dictionary';
import { OrganizationController } from '../controllers/OrganizationController';
import { SearchApiAuthenticationController } from '../controllers/SearchApiAuthenticationController';
import { ExtensionController } from '../controllers/ExtensionController';
import { UsageAnalyticsController } from '../controllers/UsageAnalyticsController';
import { SecurityProviderController } from '../controllers/SecurityProviderController';
import { QueryPipelineController } from '../controllers/QueryPipelineController';
import { HostedSearchPagesController } from '../controllers/HostedSearchPageController';
import { FieldController } from '../controllers/FieldController';
import { Organization } from '../models/OrganizationModel';
import { config } from '../config/index';
import { DiffResult } from '../models/DiffResult';
import { DiffUtils } from '../commons/utils/DiffUtils';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
import * as fs from 'fs-extra';
import { Logger } from '../commons/logger';

// Command class
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

  public diff(): void {
  }

  public diffFields() {
    let fieldController: FieldController = new FieldController();
    let fieldDiff: Dictionary<IDiffResult<any>> = fieldController.diff(this.organization1, this.organization2, []);
    fs.writeJSON('fieldDiff.json', fieldDiff, { spaces: 2 })
      .then(() => {
        Logger.info('File Saved as fieldDiff.json');
      }).catch((err: any) => {
        Logger.error('Unable to save setting file', err);
      });

    opn('fieldDiff.json');
  }
}
