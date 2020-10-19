import * as program from 'commander';
import { isArray, union } from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { IBlacklistObjects, Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';

program
  .command('diff-sources <origin> <destination> [apiKey...]')
  .description('Diff the sources of 2 organizations')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
  .option(
    '-S, --ignoreSources []',
    'List of sources to ignore. String separated by ",". If no specified, all the sources will be diffed',
    CommanderUtils.list,
    []
  )
  // Maybe we can use one of these options
  // .option('-M, --skipMappings', 'Keys to ignore. String separated by ",".', false)
  // .option('-E, --skipExtensions', 'Keys to ignore. String separated by ",".', false)

  // Not sure ignore keys are relavant here
  .option(
    '-E, --ignoreExtensions []',
    'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
    CommanderUtils.list
  )
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action(async (origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'diff-sources');
    if (isArray(apiKey) && apiKey.length === 0) {
      apiKey[0] = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    // TODO: add option to modify these options from the command BUT KEEP MANDATORY PARAMETERS
    const includeOnly = [
      'name', // mandatory
      'sourceType', // mandatory
      'crawlerInstanceType', // mandatory
      'logicalIndex',
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

    // Set diff options
    const diffOptions: IDiffOptions = {
      silent: options.silent,
      includeOnly: includeOnly,
      keysToIgnore: keysToIgnore,
    };

    const blacklistOptions: IBlacklistObjects = {
      extensions: union(['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'], options.ignoreExtensions),
      sources: options.ignoreSources,
    };

    const originOrg = new Organization(origin, apiKey[0], { blacklist: blacklistOptions, platformUrl: program.opts()?.platformUrlOrigin });
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], {
      blacklist: blacklistOptions,
      platformUrl: program.opts()?.platformUrlDestination,
    });
    const controller: SourceController = new SourceController(originOrg, destinationOrg);

    controller.diff(diffOptions);
  });
