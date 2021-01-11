import * as program from 'commander';
import { union } from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('upload-sources <origin> [apiKey]')
  .description('Upload sources to an organization.')
  .option(
    '-t, --silent',
    'When specified, the graduation will not ask for user confirmation. Useful when the operation is running in an automated process',
    false
  )
  .option('-f, --fileToUpload <path>', 'Path to file containing source configuration')
  .option(
    '-S, --ignoreSources []',
    'List of sources to ignore. String separated by ",". If no specified, all the sources will be diffed',
    CommanderUtils.list,
    []
  )
  .option(
    '-E, --ignoreExtensions []',
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
          silent: options.silent,
          keyWhitelist: includeOnly,
          keyBlacklist: keysToIgnore,
          rebuild: options.rebuild,
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1,
        };

        const blacklistOptions = {
          sources: union(
            ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
            options.ignoreSources
          ),
        };
        const originOrg = new DummyOrganization();
        const destinationOrg = new Organization(destination, apiKey, {
          blacklist: blacklistOptions,
          platformUrl: program.opts()?.platformUrlDestination,
        });
        const controller: SourceController = new SourceController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
