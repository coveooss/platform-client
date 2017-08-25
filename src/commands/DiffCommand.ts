// External packages
import * as opn from 'opn';
import { IDiffResult } from '../commons/interfaces/IDiffResult';
// Internal packages
import { BaseCommand } from './BaseCommand';
import { ICommand } from '../commons/interfaces/ICommand';
import { DiffResultsPageHtmlTemplate, DiffResultsItemTemplate } from '../commons/templates/diff-results-template'
import { FileUtils } from '../commons/utils/FileUtils';
import { Dictionary } from '../commons/collections/Dictionary';
import { OrganizationController } from '../controllers/OrganizationController';
import { SourceController } from '../controllers/SourceController';
import { SearchApiAuthenticationController } from '../controllers/SearchApiAuthenticationController';
import { ExtensionController } from '../controllers/ExtensionController';
import { UsageAnalyticsController } from '../controllers/UsageAnalyticsController';
import { SecurityProviderController } from '../controllers/SecurityProviderController';
import { QueryPipelineController } from '../controllers/QueryPipelineController';
import { HostedSearchPagesController } from '../controllers/HostedSearchPageController';
import { FieldController } from '../controllers/FieldController';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { Organization } from '../models/OrganizationModel';
import { config } from '../config/index';
import { DiffResult } from '../models/DiffResult';
import { DiffUtils } from '../commons/utils/DiffUtils';

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
    this.optionalParameters.Add('fieldstoignore', 'id,account,html,configuration.parameters.OrganizationId.value,configuration.parameters.SourceId.value');
    this.optionalParameters.Add('scope', 'organization,fields,extensions,authentications,usageanalytics,sources,securityproviders,querypipelines,hostedsearchpages');
    this.optionalParameters.Add('openinbrowser', 'true');

    this.validations.Add('(command.optionalParameters.Item("originapikey") != "")',
      'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
    this.validations.Add('(command.optionalParameters.Item("destinationapikey") != "")',
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
    let diffResults: Dictionary<IDiffResult<any>> = new Dictionary<IDiffResult<any>>();

    /*** Organizations Diff ***/
    if (this.inScope('organization')) {
      let organizationController: OrganizationController = new OrganizationController();
      diffResults.Add(
        'Organization configuration',
        organizationController.diff(organization1, organization2, fieldsToIgnore)
      );
    }

    /*** Fields Diff ***/
    if (this.inScope('fields')) {
      let fieldController: FieldController = new FieldController();
      let fieldDiff: Dictionary<IDiffResult<any>> = fieldController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Fields', diffResults, fieldDiff);
    }

    /*** Security providers Diff ***/
    if (this.inScope('securityproviders')) {
      let securityProviderController: SecurityProviderController = new SecurityProviderController();
      let securityProviderDiff: Dictionary<IDiffResult<any>> = securityProviderController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Security Providers', diffResults, securityProviderDiff);
    }

    /*** Sources Diff ***/
    if (this.inScope('sources')) {
      let sourceController: SourceController = new SourceController();
      let sourceDiff: Dictionary<IDiffResult<any>> = sourceController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Sources', diffResults, sourceDiff);
    }

    /*** Extensions Diff ***/
    if (this.inScope('extensions')) {
      let extensionController: ExtensionController = new ExtensionController();
      let extensionsDiff: Dictionary<IDiffResult<any>> = extensionController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Extensions', diffResults, extensionsDiff);
    }

    /*** Query pipelines Diff ***/
    if (this.inScope('querypipelines')) {
      let queryPipelineController: QueryPipelineController = new QueryPipelineController();
      let queryPipelinesDiff: Dictionary<IDiffResult<any>> = queryPipelineController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Query Pipelines', diffResults, queryPipelinesDiff);
    }

    /*** Search API Authentication Diff ***/
    if (this.inScope('authentications')) {
      let searchApiAuthenticationController: SearchApiAuthenticationController = new SearchApiAuthenticationController();
      let searchApiAuthenticationDiff: Dictionary<IDiffResult<any>> = searchApiAuthenticationController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Authentications', diffResults, searchApiAuthenticationDiff);
    }

    /*** Hosted Search Pages Diff ***/
    if (this.inScope('hostedsearchpages')) {
      let hostedSearhPagesController: HostedSearchPagesController = new HostedSearchPagesController();
      let hostedSearchPagesDiff: Dictionary<IDiffResult<any>> = hostedSearhPagesController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Hosted Search Pages', diffResults, hostedSearchPagesDiff);
    }

    /*** UA Diff ***/
    if (this.inScope('usageanalytics')) {
      let usageAnalyticsController: UsageAnalyticsController = new UsageAnalyticsController();
      let usageAnalyticsDiff: Dictionary<IDiffResult<any>> = usageAnalyticsController.diff(organization1, organization2, fieldsToIgnore);

      diffResults = DiffUtils.addToMainDiff('Added or deleted Usage Analytics Reports', diffResults, usageAnalyticsDiff);
    }

    // TODO: Build the sections based on the diff results provided
    let formattedDiff: Array<string> = new Array<string>();
    diffResults.Keys().forEach(function (key: string) {
      if (diffResults.Item(key).ContainsItems()) {
        formattedDiff.push(DiffResultsItemTemplate(key, diffResults.Item(key)));
      }
    });

    // TODO: Do something if formatted diff is empty... like showing a "the org are the same" message
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

  private inScope(section: string): boolean {
    return (this.optionalParameters.Item('scope').indexOf(section) > -1);
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

