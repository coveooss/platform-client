import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';

program
  .command('upload-sources <origin> <apiKey> <filePathToUpload>')
  .description('(beta) Upload sources to an organization.')
  .option(
    '-S, --ignoreSources []',
    'List of sources to diff. String separated by ",". If no specified, all the sources will be diffed',
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
  .action((destination: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-sources');

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

    FileUtils.readJson(filePathToUpload)
      .then(data => {
        // Set graduation options
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

        const blacklistOptions = {
          sources: _.union(
            ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
            options.ignoreSources
          )
        };
        const command = new GraduateCommand('dummyOrg', destination, apiKey, apiKey, blacklistOptions);
        command.graduateSources(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
