import * as program from 'commander';
import { union } from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';

program
  .command('upload-sources <origin> <apiKey> <filePathToUpload>')
  .description('(beta) Upload sources to an organization.')
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

    FileUtils.readJson(filePathToUpload)
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

        const blacklistOptions = {
          sources: union(
            ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
            options.ignoreSources
          ),
        };
        const originOrg = new Organization('dummyOrg', '', { blacklist: blacklistOptions, platformUrl: program.opts()?.platformUrlOrigin });
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
