import * as program from 'commander';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IOrganizationOptions, Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { isArray } from 'underscore';

program
  .command('graduate-fields <origin> <destination> [apiKey...]')
  .description('Graduate fields from one organization to another')
  .option(
    '-t, --silent',
    'When specified, the graduation will not ask for user confirmation. Useful when the operation is running in an automated process',
    false
  )
  .option('-n, --onlyFields []', 'Only the fields to diff.', CommanderUtils.list, [])
  .option('-i, --ignoreFields []', 'Fields to ignore. String separated by ","', CommanderUtils.list, [])
  .option(
    '-o, --onlyKeys []',
    'Diff only the specified field attributes (ex: sort, facet, stemming, ...). String separated by ","',
    CommanderUtils.list,
    []
  )
  .option(
    '-S, --sources []',
    'If specified, the operation will only graduate fields that are associated to specified sources.',
    CommanderUtils.list,
    []
  )
  .option(
    '-m, --methods []',
    'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces)',
    CommanderUtils.list,
    ['POST', 'PUT']
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action(async (origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'graduate-fields');
    if (isArray(apiKey) && apiKey.length === 0) {
      apiKey[0] = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    // Validate strategy
    if (options.onlyFields.length > 0 && options.ignoreFields.length > 0) {
      Logger.error('Cannot choose both whitelist and blacklist strategy. Please choose one or the other.');
      process.exit();
    }

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      diffOptions: {
        // keysToIgnore: _.union(options.ignoreKeys, ['sources']),
        keysToIgnore: ['sources', 'system'],
        includeOnly: options.onlyKeys,
        silent: options.silent,
        sources: options.sources,
      },
      // keyBlacklist: _.union(options.ignoreKeys, ['sources']),
      silent: options.silent,
      keyBlacklist: ['sources', 'system'],
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1,
    };

    const originOrgOptions: IOrganizationOptions = {
      platformUrl: program.opts()?.platformUrlOrigin,
    };
    const destinationOrgOptions: IOrganizationOptions = {
      platformUrl: program.opts()?.platformUrlDestination,
    };

    if (options.ignoreFields && options.ignoreFields.length > 0) {
      originOrgOptions.blacklist = destinationOrgOptions.blacklist = {
        fields: options.ignoreFields,
      };
    }

    if (options.onlyFields && options.onlyFields.length > 0) {
      originOrgOptions.whitelist = destinationOrgOptions.whitelist = {
        fields: options.onlyFields,
      };
    }

    const originOrg = new Organization(origin, apiKey[0], originOrgOptions);
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], destinationOrgOptions);
    const controller: FieldController = new FieldController(originOrg, destinationOrg);

    controller.graduate(graduateOptions);
  });
