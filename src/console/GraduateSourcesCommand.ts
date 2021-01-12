import * as program from 'commander';
import { isArray, union } from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IBlacklistObjects, Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';

program
  .command('graduate-sources <origin> <destination> [apiKey...]')
  .description('Graduate sources from one organization to another')
  .option(
    '-t, --silent',
    'When specified, the graduation will not ask for user confirmation. Useful when the operation is running in an automated process',
    false
  )
  // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
  .option('-i, --keysToIgnore []', 'Keys to ignore from the JSON configuration. String separated by ","', CommanderUtils.list, [])
  .option(
    '-I, --skipFieldIntegrity',
    'When specified, the graduation will not validate field integrity. Otherwise, the graduation will fail if at least one source to graduate references fields that do not exist in the desintation org',
    false
  )
  .option(
    '-S, --ignoreSources []',
    'List of sources to ignore. String separated by ",". If no specified, all the sources will be diffed',
    CommanderUtils.list,
    []
  )
  // TODO: provide option to rebuild
  // .option('-r, --rebuild', 'Rebuild source after graduation')
  .option(
    '-E, --ignoreExtensions []',
    'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
    CommanderUtils.list
  )
  .option(
    '-m, --methods []',
    'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces)',
    CommanderUtils.list,
    ['POST', 'PUT']
  )
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action(async (origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'graduate-sources');
    if (isArray(apiKey) && apiKey.length === 0) {
      apiKey[0] = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
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
      'crawlingModuleId',
    ];

    const graduateOptions: IGraduateOptions = {
      diffOptions: {
        silent: options.silent,
        includeOnly: includeOnly,
        keysToIgnore: [...options.keysToIgnore, ...keysToIgnore],
      },
      silent: options.silent,
      keyWhitelist: includeOnly,
      keyBlacklist: keysToIgnore,
      ensureFieldIntegrity: !options.skipFieldIntegrity,
      rebuild: options.rebuild,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1,
    };

    const blacklistOptions: IBlacklistObjects = {
      extensions: union(
        ['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues', 'capturemetadata'],
        options.ignoreExtensions
      ),
      sources: options.ignoreSources,
    };

    const originOrg = new Organization(origin, apiKey[0], { blacklist: blacklistOptions, platformUrl: program.opts()?.platformUrlOrigin });
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], {
      blacklist: blacklistOptions,
      platformUrl: program.opts()?.platformUrlDestination,
    });
    const controller: SourceController = new SourceController(originOrg, destinationOrg);

    controller.graduate(graduateOptions);
  });
