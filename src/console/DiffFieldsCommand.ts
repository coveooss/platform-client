import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';

export const DiffFieldsCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-fields <origin> <destination> <apiKey>')
    .description(['Diff the user defined fields of 2 organizations'])
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    .option('-i, --ignoreKeys []', 'Keys to ignore. String separated by ","', commanderUtils.list)
    .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', commanderUtils.list)
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'diff-fields');

      // Set diff options
      const diffOptions: IDiffOptions = {
        keysToIgnore: options.ignoreKeys,
        includeOnly: options.onlyKeys,
        silent: options.silent
      };

      const command = new DiffCommand(origin, destination, apiKey, apiKey);
      command.diffFields(diffOptions);
    });
};
