import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';

export const DiffPagesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-page <origin> <destination> <apiKey>')
    .description(['Diff the pages of 2 organizations'])
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', commanderUtils.list)
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'diff-page');

      // Set diff options
      const diffOptions: IDiffOptions = {
        // includeOnly: options.onlyKeys, // Nothing else to diff other than the html
        silent: options.silent
      };

      const blacklistOptions = {
        pages: options.ignorePages
      };
      const command = new DiffCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      command.diffPages(diffOptions);
    });
};
