import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';
import { IBlacklistObjects } from '../coveoObjects/Organization';

export const GraduateSourcesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('graduate-sources <origin> <destination> <apiKey>')
    .description([`Graduate the sources of 2 organizations`])
    // .option('-r, --rebuild', 'Rebuild the source once created. Default is false', false)
    .option(
      '-S, --ignoreSources []',
      'List of sources to diff. String separated by ",". If no specified, all the sources will be diffed',
      commanderUtils.list,
      []
    )
    // TODO: provide option to rebuild
    // .option('-r, --rebuild', 'Rebuild source after graduation')
    .option(
      '-E, --ignoreExtensions []',
      'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
      commanderUtils.list
    )
    .option(
      '-m, --methods []',
      'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces)',
      commanderUtils.list,
      ['POST', 'PUT']
    )
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'graduate-sources');

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
        'additionalInfos'
      ];

      const keysToIgnore = [
        'configuration.parameters.SourceId',
        'configuration.parameters.OrganizationId',
        'configuration.parameters.ClientSecret',
        'configuration.parameters.ClientId',
        'configuration.parameters.IsSandbox',
        'additionalInfos.salesforceOrg',
        'additionalInfos.salesforceUser',
        'additionalInfos.salesforceOrgName'
      ];

      const graduateOptions: IGraduateOptions = {
        diffOptions: {
          silent: options.silent,
          includeOnly: includeOnly,
          keysToIgnore: keysToIgnore
        },
        keyWhitelist: includeOnly,
        keyBlacklist: keysToIgnore,
        rebuild: options.rebuild,
        POST: options.methods.indexOf('POST') > -1,
        PUT: options.methods.indexOf('PUT') > -1,
        DELETE: options.methods.indexOf('DELETE') > -1
      };

      const blacklistOptions: IBlacklistObjects = {
        extensions: _.union(
          ['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues', 'capturemetadata'],
          options.ignoreExtensions
        ),
        sources: options.ignoreSources
      };
      const command = new GraduateCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      command.graduateSources(graduateOptions);
    });
};
