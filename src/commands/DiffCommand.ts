// Old school import so we can access other libraries
declare function require(name: string): any;
// External packages
// import * as opn from 'opn';
// Internal packages
import { BaseCommand } from './BaseCommand';
import { ICommand } from '../commons/interfaces/ICommand';
import { DiffResultsPageHtmlTemplate, DiffResultsItemTemplate } from '../commons/templates/diff-results-template'
import { FileUtils } from '../commons/utils/FileUtils';
import { FieldController } from '../controllers/FieldController';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { Organization } from '../models/OrganizationModel'
import { config } from '../config/index';

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
    this.optionalParameters.Add('paramstostrip', 'organizationId,sourceId');
    this.optionalParameters.Add('scope', 'fields,extensions,sources,pipelines,hostedsearchpages');
    this.optionalParameters.Add('openinbrowser', 'true');

    this.validations.Add('(this.optionalParameters["originapikey"] != "")', 
      'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
    this.validations.Add('(this.optionalParameters["destinationapikey"] != "")',
      'Need an API key for the destination organization (destinationApiKey), as a parameter or in the settings file');
  }

  public Execute(): void {
    // Create an array of diffs to put the results for each section
    let diffResultsItems: Array<string> = new Array<string>();

    // Get the params to strip.
    let PARAMS_TO_STRIP: Array<string> = this.optionalParameters.Item('paramstostrip').toLowerCase().split(',');

    // Extensions
    // HERE, call the proper method.

    // Sources
    // HERE, call the proper method.

    // Pipelines
    // HERE, call the proper method.

    /*** Fields Diff ***/
    let organization1: IOrganization = new Organization (
      this.mandatoryParameters[0],
      'xx-xxxxx-xxxx-xxxx-xx'
    );
    let organization2: IOrganization = new Organization (
      this.mandatoryParameters[1],
      'yy-yyyyy-yyyy-yyyy-yy'
    );

    let fieldController: FieldController = new FieldController(organization1, organization2);

    let testDiff = DiffResultsItemTemplate('Diff Section', fieldController.diff((values => {
      console.log('*********************');
      console.log(values);
      console.log('*********************');

    })));
    diffResultsItems.push(testDiff);

    // Format the whole diff document
    let diffReport: string = DiffResultsPageHtmlTemplate(
      organization1.Id,
      organization2.Id,
      diffResultsItems
    );

    // Write the file to the proper location
    // TODO: handle absolute and relative paths
    // FileUtils.writeFile(this.optionalParameters.Item('outputfile'), diffReport, function (err: NodeJS.ErrnoException) {
    //   if (err) {
    //     throw console.error(err);
    //   }
    // });

    // console.log('Diff is done, you can view results here: ' + this.optionalParameters.Item('outputfile'));

    if (this.optionalParameters.Item('openinbrowser') === 'true') {
      // opn(this.optionalParameters.Item('outputfile'));
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

