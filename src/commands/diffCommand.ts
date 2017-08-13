// Old school import so we can access other libraries
declare function require(name: string): any;
// External packages
import * as opn from 'opn';
// Internal packages
import { BaseCommand } from './baseCommand';
import { ICommand } from '../commons/interfaces/icommand';
import { DiffResultsPageHtmlTemplate, DiffResultsItemTemplate } from '../commons/templates/diff-results-template'
import { FileUtils } from '../commons/utils/fileUtils';
import { FieldController } from '../controllers/fieldController';
import { IOrganizationIdentifier } from '../commons/interfaces/iorganization';

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
    this.optionalParameters.Add('outputfile', `./output/diff-${Date.now()}.html`);
    this.optionalParameters.Add('paramstostrip', 'organizationId,sourceId');
    this.optionalParameters.Add('scope', 'fields,extensions,sources,pipelines,hostedsearchpages');
    this.optionalParameters.Add('openinbrowser', 'true');

    this.validations.Add('(this.optionalParameters["originapikey"] != "")', 'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
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
    let organization1: IOrganizationIdentifier = {
      id: this.mandatoryParameters[0],
      apiKey: 'xx-xxxxx-xxxx-xxxx-xx'
    };
    let organization2: IOrganizationIdentifier = {
      id: this.mandatoryParameters[1],
      apiKey: 'yy-yyyyy-yyyy-yyyy-yy'
    };

    let fieldController1: FieldController = new FieldController(organization1, organization2);

    let testDiff = DiffResultsItemTemplate('Diff Section', fieldController1.diff());
    diffResultsItems.push(testDiff);

    // Format the whole diff document
    let diffReport: string = DiffResultsPageHtmlTemplate(
      organization1.id,
      organization2.id,
      diffResultsItems
    );

    // Write the file to the proper location
    // TODO: handle absolute and relative paths
    FileUtils.writeFile(this.optionalParameters.Item('outputfile'), diffReport, function (err: NodeJS.ErrnoException) {
      if (err) {
        throw console.error(err);
      }
    });

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

