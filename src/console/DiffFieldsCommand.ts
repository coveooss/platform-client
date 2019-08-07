// import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';

export const DiffFieldsCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-fields <origin> <destination> <apiKey...>')
    .description('Diff the user defined fields of 2 organizations')
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    .option(
      '-S, --sources []',
      'Load fields that are associated to specific sources. Leaving this parameter empty will diff all fields.',
      commanderUtils.list,
      []
    )
    .option('-i, --ignoreKeys []', 'Keys to ignore.', commanderUtils.list, [])
    .option('-o, --onlyKeys []', 'Diff only the specified keys.', commanderUtils.list, [])
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string[], options: any) => {
      commanderUtils.setLogger(options, 'diff-fields');

      // Set diff options
      const diffOptions: IDiffOptions = {
        // keysToIgnore: _.union(options.ignoreKeys, ['sources']),
        keysToIgnore: ['sources'], // TODO: have presence over includeOnly. Remove includeOnly!
        includeOnly: options.onlyKeys,
        silent: options.silent,
        sources: options.sources
      };

      const command = new DiffCommand(origin, destination, apiKey[0], apiKey[apiKey.length > 1 ? 1 : 0]);
      command.diffFields(diffOptions);
    });
};
