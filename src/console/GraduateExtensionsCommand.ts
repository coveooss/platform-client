import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';

program
  .command('graduate-extensions <origin> <destination> <apiKey...>')
  .description('Graduate extensions from one organization to another')
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', CommanderUtils.list, [
    'requiredDataStreams',
    'content',
    'description',
    'name'
  ])
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
  .action((origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'graduate-extensions');

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      diffOptions: {
        includeOnly: options.onlyKeys,
        silent: options.silent
      },
      keyWhitelist: options.onlyKeys,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1
    };

    const blacklistOptions = {
      extensions: _.union(
        ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
        options.ignoreExtensions
      )
    };
    const command = new GraduateCommand(origin, destination, apiKey[0], apiKey[apiKey.length > 1 ? 1 : 0], blacklistOptions);
    command.graduateExtensions(graduateOptions);
  });
