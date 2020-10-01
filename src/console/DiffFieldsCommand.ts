// import {} from 'underscore';
import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { IBlacklistObjects, Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';

program
  .command('diff-fields <origin> <destination> <apiKey...>')
  .description('Diff the "user defined fields" of 2 organizations')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option(
    '-S, --sources []',
    'Load fields that are associated to specific sources. Leaving this parameter empty will diff all fields.',
    CommanderUtils.list,
    []
  )
  // .option('-i, --ignoreKeys []', 'Field keys to ignore (e.g. "facet","description").', CommanderUtils.list, [])
  .option('-i, --ignoreFields []', 'Fields to ignore.', CommanderUtils.list, [])
  .option('-o, --onlyKeys []', 'Diff only the specified keys.', CommanderUtils.list, [])
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ platformclient diff-fields --help');
    console.log('  $ platformclient diff-fields devOrg prodOrg masterApiKey');
    console.log('  $ platformclient diff-fields devOrg prodOrg devApiKey prodApiKey --onlyKeys facet,sort');
  })
  .action((origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'diff-fields');

    // Set diff options
    const diffOptions: IDiffOptions = {
      // keysToIgnore: _.union(options.ignoreKeys, ['sources']),
      keysToIgnore: ['sources'], // TODO: have precedence over includeOnly. Remove includeOnly!
      includeOnly: options.onlyKeys,
      silent: options.silent,
      sources: options.sources,
    };

    const blacklistOptions: IBlacklistObjects = {
      fields: options.ignoreFields,
    };

    const originOrg = new Organization(origin, apiKey[0], { blacklist: blacklistOptions, platformUrl: program.opts()?.platformUrlOrigin });
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], {
      blacklist: blacklistOptions,
      platformUrl: program.opts()?.platformUrlDestination,
    });
    const controller: FieldController = new FieldController(originOrg, destinationOrg);

    controller.diff(diffOptions);
  });
