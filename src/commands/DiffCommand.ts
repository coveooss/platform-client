// Old school import so we can access other libraries
declare function require(name: string): any;
// External packages
// import * as opn from 'opn';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
// Internal packages
import { BaseCommand } from './BaseCommand';
import { ICommand } from '../commons/interfaces/ICommand';
import { DiffResultsPageHtmlTemplate, DiffResultsItemTemplate } from '../commons/templates/diff-results-template'
import { FileUtils } from '../commons/utils/FileUtils';
import { Dictionary } from '../commons/collections/Dictionary';
import { OrganizationController } from '../controllers/OrganizationController';
import { FieldController } from '../controllers/FieldController';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { Organization } from '../models/OrganizationModel';
import { config } from '../config/index';
import { DiffResult } from '../models/DiffResult';
import * as opn from 'opn';

// Command class
export class DiffCommand extends BaseCommand implements ICommand {
  // Command name
  static COMMAND_NAME: string = 'diff';

  constructor() {
    super();

    this.mandatoryParameters.push('originOrganization');
    this.mandatoryParameters.push('destinationOrganization');

    this.optionalParameters.Add('originapikey', '');
    this.optionalParameters.Add('destinationapikey', '');
    this.optionalParameters.Add('outputfile', `${config.workingDirectory}output/diff-${Date.now()}.html`);
    this.optionalParameters.Add('fieldstoignore', 'id');
    this.optionalParameters.Add('scope', 'organization,fields,extensions,sources,pipelines,hostedsearchpages');
    this.optionalParameters.Add('openinbrowser', 'true');

    this.validations.Add('(this.optionalParameters["originapikey"] != "")',
      'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
    this.validations.Add('(this.optionalParameters["destinationapikey"] != "")',
      'Need an API key for the destination organization (destinationApiKey), as a parameter or in the settings file');
  }

  public Execute(): void {
    let organization1: IOrganization = new Organization(
      this.mandatoryParameters[0],
      this.optionalParameters.Item('originapikey')
    );
    let organization2: IOrganization = new Organization(
      this.mandatoryParameters[1],
      this.optionalParameters.Item('destinationapikey')
    );

    // Get the params to strip.
    let fieldsToIgnore: Array<string> = this.optionalParameters.Item('fieldstoignore').toLowerCase().split(',');

    // Create an array of diffs to put the results for each section
    let diffResults: Dictionary<DiffResult<any>> = new Dictionary<DiffResult<any>>();

    // Organizations
    let organizationController:OrganizationController = new OrganizationController();
    if (this.optionalParameters.Item('scope').indexOf('organization') > -1) {
      diffResults.Add(
        'Organization configuration',
        organizationController.diff(organization1, organization2, fieldsToIgnore)
      );
    }

    // Extensions
    // HERE, call the proper method.

    // Sources
    // HERE, call the proper method.

    // Pipelines
    // HERE, call the proper method.

    /*** Fields Diff ***/

    let fieldController: FieldController = new FieldController(organization1, organization2);

    // TODO: type values
    // TODO: Put it at the end. We should store all the diffresults first, then build the report
    // TODO: Not use a callback for something that should be sequential.
    /*
    let testDiff = DiffResultsItemTemplate('Diff Section', fieldController.diff(((values: any) => {
      console.log('*********************');
      console.log(values);
      console.log('*********************');

    })));
    diffResults.Add('Fields', <any>testDiff);
    */

    // TODO: Build the sections based on the diff results provided
    let formattedDiff: Array<string> = new Array<string>();
    diffResults.Keys().forEach(function (key) {
      formattedDiff.push(DiffResultsItemTemplate(key, diffResults.Item(key)));
    });

    // Format the whole diff document
    let diffReport: string = DiffResultsPageHtmlTemplate(
      organization1.Id,
      organization2.Id,
      formattedDiff
    );

    // Write the report file to disk
    FileUtils.writeFile(this.optionalParameters.Item('outputfile'), diffReport, function (err: NodeJS.ErrnoException) {
      if (err) {
        throw console.error(err);
      }
    });

    // Display the report location and, if the option is set to true, open in browser.
    console.log('Diff is done, you can view results here: ' + this.optionalParameters.Item('outputfile'));

    if (this.optionalParameters.Item('openinbrowser') === 'true') {
      opn(this.optionalParameters.Item('outputfile'));
    }
  }

  private jsonDiffOptions(): {} {
    return {
      objectHash: function (obj: any) {
        return obj._id || obj.id;
      },
      arrays: {
        detectMove: true,
        includeValueOnMove: false
      },
      textDiff: {
        minLength: 60
      },
      propertyFilter: function (name: any, context: any) {
        return name.slice(0, 1) !== '$';
      },
      cloneDiffValues: false
    }
  }
}

