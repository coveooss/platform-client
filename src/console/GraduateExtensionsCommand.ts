import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';

export const GraduateExtensionsCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('graduate-extensions <origin> <destination> <apiKey>')
    .description('Graduate one organisation to an other')
    .option(
      '-o, --onlyKeys []',
      'Diff only the specified keys. String separated by ",". By default, the extension diff will ignore the following keys: "requiredDataStreams", "content", "description" and "name"',
      commanderUtils.list
    )
    .option(
      '-e, --ignoreExtensions []',
      'Extensions to ignore. String separated by ",". By default, the diff will ignore the : "All metadata values" extension',
      commanderUtils.list
    )
    .option(
      '-m, --methods []',
      'HTTP method authorized by the Graduation. Currently, only "POST" method is allowed for extensions.',
      commanderUtils.list,
      ['POST', 'PUT']
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info (default), error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .action((origin: string, destination: string, apiKey: string, options: any) => {
      commanderUtils.setLogger(options, 'graduate-extensions');

      // Set graduation options
      const graduateOptions: IGraduateOptions = {
        diffOptions: {
          includeOnly: options.onlyKeys,
          silent: options.silent
        },
        POST: options.methods.indexOf('POST') > -1,
        PUT: options.methods.indexOf('PUT') > -1,
        DELETE: options.methods.indexOf('DELETE') > -1
      };

      const blacklistOptions = {
        extensions: _.union(['allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'], options.ignoreExtensions)
      };
      const command = new GraduateCommand(origin, destination, apiKey, apiKey, blacklistOptions);
      if (!graduateOptions.diffOptions.includeOnly) {
        graduateOptions.diffOptions.includeOnly = ['requiredDataStreams', 'content', 'description', 'name'];
      }
      command.graduateExtensions(graduateOptions);
    });
};
