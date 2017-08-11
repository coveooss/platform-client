// Old school import so we can access other libraries
declare function require(name:string):any;
// External packages
import * as fs from 'fs';
import * as opn from 'opn';
// Internal packages
import {BaseCommand} from './base-command';
import {ICommand} from '../commons/interfaces/icommand';
import {DiffResultsPageHtmlTemplate, DiffResultsItemTemplate} from '../commons/templates/diff-results-template'

// Command name
export const COMMAND_NAME = 'diff';

// Command class
export class DiffCommand extends BaseCommand implements ICommand {
  constructor() {
    super();

    this.mandatoryParameters.push('originOrganization');
    this.mandatoryParameters.push('destinationOrganization');

    this.optionalParameters.Add('originapikey', '');
    this.optionalParameters.Add('destinationapikey', '');
    this.optionalParameters.Add('outputfile', './exports/diff-' + Date.now() + '.html');
    this.optionalParameters.Add('paramstostrip', 'organizationId,sourceId');
    this.optionalParameters.Add('scope', 'fields,extensions,sources,pipelines,hostedsearchpages');
    this.optionalParameters.Add('openinbrowser', 'true');

    this.validations.Add('(this.optionalParameters["originapikey"] != "")', 'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
    this.validations.Add('(this.optionalParameters["destinationapikey"] != "")', 'Need an API key for the destination organization (destinationApiKey), as a parameter or in the settings file');
  }

  public Execute():void {
    // Initialize the diff package
    var jsondiffpatch = require('jsondiffpatch');
    var diff:any = jsondiffpatch.create(this.jsonDiffOptions())

    // Create an array of diffs to put the results for each section
    var diffResultsItems:Array<string> = new Array<string>();

    // Get the params to strip.
    var PARAMS_TO_STRIP:Array<string> = this.optionalParameters.Item("paramstostrip").toLowerCase().split(",");

    // Get organization 1
    // TODO: Use real data
    var organization1 = {
      'organizationId': '',
      'IdenticalParam': 'It is the same',
      'Different param': 'It\'s not the same',
    };

    // Get organization 2
      var organization2 = {
      'organizationId': '',
      'IdenticalParam': 'It is the same',
      'Different param': 'It\'s different',
    };

    // Fields
    // HERE, call the proper method.

    // Extensions
    // HERE, call the proper method.

    // Sources
    // HERE, call the proper method.

    // Pipelines
    // HERE, call the proper method.

    // Example diff for a section.
    // Will need to do the same for each section (sources, extensions, fields, pipelines, etc) 
    var delta = diff.diff(organization2, organization1);
    
    var testDiff:string = jsondiffpatch.formatters.html.format(delta, organization1);
    testDiff = DiffResultsItemTemplate('test data', testDiff);
    diffResultsItems.push(testDiff);


    // Format the whole diff document
    var diffReport:string = DiffResultsPageHtmlTemplate(
      this.mandatoryParameters[0], 
      this.mandatoryParameters[1],
      diffResultsItems
    );

    // Write the file to the proper location
    // TODO: handle absolute and relative paths
    fs.writeFile(this.optionalParameters.Item('outputfile'), diffReport,  function(err) {
        if (err) {
            throw console.error(err);
        }
    });
    
    console.log('Diff is done, you can view results here: ' + this.optionalParameters.Item('outputfile'));

    if (this.optionalParameters.Item('openinbrowser') == 'true') {
      opn(this.optionalParameters.Item('outputfile'));
    }
  }

  private jsonDiffOptions():{} {
    return {
        objectHash: function(obj:any) {
            return obj._id || obj.id;
        },
        arrays: {
            detectMove: true,
            includeValueOnMove: false
        },
        textDiff: {
            minLength: 60
        },
        propertyFilter: function(name:any, context:any) {
          return name.slice(0, 1) !== '$';
        },
        cloneDiffValues: false
    }
  }
}

