import * as program from 'commander';
import { extend } from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { IOrganizationOptions, Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('upload-sources <origin> [apiKey]')
  .description('Upload sources to an organization.')
  .option('-f, --fileToUpload <path>', 'Path to file containing source configuration')
  .option(
    '-S, --sources []',
    'List of sources to upload. If not specified all sources will be downlaoded. Source names should be separated by a comma',
    CommanderUtils.list,
    []
  )
  .option(
    '--ignoreSources []',
    'List of sources to ignore.  If not specified all sources from file will be diffed. Source names should be separated by a comma',
    CommanderUtils.list,
    []
  )
  .option(
    '--ignoreExtensions []',
    'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
    CommanderUtils.list
  )
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action(async (destination: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-sources');
    if (!options.fileToUpload) {
      Logger.error("missing required options '--fileToUpload'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlDestination);
    }

    const includeOnly = [
      'name', // mandatory
      'sourceType', // mandatory
      'crawlerInstanceType', // mandatory
      'mappings',
      'postConversionExtensions',
      'preConversionExtensions',
      'configuration.addressPatterns',
      'configuration.documentConfig',
      'configuration.extendedDataFiles',
      'configuration.parameters',
      'configuration.startingAddresses',
      'configuration.sourceSecurityOption',
      'configuration.permissions',
      'additionalInfos',
    ];

    const keysToIgnore = [
      'configuration.parameters.SourceId',
      'configuration.parameters.OrganizationId',
      'configuration.parameters.ClientSecret',
      'configuration.parameters.ClientId',
      'configuration.parameters.IsSandbox',
      'additionalInfos.salesforceOrg',
      'additionalInfos.salesforceUser',
      'additionalInfos.salesforceOrgName',
    ];

    FileUtils.readJson(options.fileToUpload)
      .then((data) => {
        // Set graduation options
        const graduateOptions: IGraduateOptions = {
          diffOptions: {
            silent: options.silent,
            includeOnly: includeOnly,
            keysToIgnore: keysToIgnore,
            originData: data,
          },
          keyWhitelist: includeOnly,
          keyBlacklist: keysToIgnore,
          rebuild: options.rebuild,
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1,
        };

        const orgOptions: IOrganizationOptions = {};
        if (options.ignoreSources.length > 0) {
          orgOptions.blacklist = { sources: options.ignoreSources };
        }
        if (options.sources.length > 0) {
          orgOptions.whitelist = { sources: options.sources };
        }
        if (options.ignoreSources.length > 0 && options.sources.length > 0) {
          Logger.error('Cannot specify both --sources and --ignoreSources options. Choose one or the other');
          process.exit();
        }

        const originOrg = new DummyOrganization(orgOptions);
        const destinationOrg = new Organization(
          destination,
          apiKey,
          extend(orgOptions, {
            platformUrl: program.opts()?.platformUrlDestination,
          })
        );

        const controller: SourceController = new SourceController(originOrg, destinationOrg);
        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
