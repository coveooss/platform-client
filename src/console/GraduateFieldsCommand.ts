import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';

export const GraduateFieldsCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('graduate-fields <origin> <destination> <apiKey>')
    .description('Graduate one organization to an other')
    .option('-i, --ignoreKeys []', 'Keys to ignore. String separated by ","', commanderUtils.list)
    .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', commanderUtils.list)
    .option(
      '-m, --methods []',
      'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces)',
      commanderUtils.list,
      ['POST', 'PUT']
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'graduate-fields');

      // Set graduation options
      const graduateOptions: IGraduateOptions = {
        diffOptions: {
          keysToIgnore: options.ignoreKeys,
          includeOnly: options.onlyKeys,
          silent: options.silent
        },
        POST: options.methods.indexOf('POST') > -1,
        PUT: options.methods.indexOf('PUT') > -1,
        DELETE: options.methods.indexOf('DELETE') > -1
      };

      const command = new GraduateCommand(origin, destination, apiKey, apiKey);
      command.graduateFields(graduateOptions);
    });
};
