import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commands/DiffCommand';

export const GraduatePagesCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('graduate-pages <origin> <destination> <apiKey...>')
    .description('Graduate one organization to an other')
    .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', commanderUtils.list)
    .option('-m, --methods []', 'HTTP method authorized by the Graduation', commanderUtils.list, ['POST', 'PUT'])
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'graduate-pages');

      const includeOnly = [
        'name', // mandatory
        'title', // mandatory
        'html'
      ];

      // Set diff options
      const diffOptions: IDiffOptions = {
        silent: options.silent,
        includeOnly: includeOnly
      };

      // Set graduation options
      const graduateOptions: IGraduateOptions = {
        diffOptions: diffOptions,
        POST: options.methods.indexOf('POST') > -1,
        PUT: options.methods.indexOf('PUT') > -1,
        DELETE: options.methods.indexOf('DELETE') > -1
      };

      const blacklistOptions = {
        pages: options.ignorePages
      };
      const command = new GraduateCommand(origin, destination, apiKey[0], apiKey[apiKey.length > 1 ? 1 : 0], blacklistOptions);
      command.graduatePages(graduateOptions);
    });
};
