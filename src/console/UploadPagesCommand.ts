import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { GraduateCommand, IGraduateOptions } from '../commands/GraduateCommand';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commands/DiffCommand';
import { FileUtils } from '../commons/utils/FileUtils';

program
  .command('upload-pages <origin> <apiKey> <filePathToUpload>')
  .description('Upload pages to an organization.')
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((destination: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-pages');

    FileUtils.readJson(filePathToUpload)
      .then(data => {
        const includeOnly = [
          'name', // mandatory
          'title', // mandatory
          'html'
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          silent: options.silent,
          includeOnly: includeOnly,
          originData: data
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
        const command = new GraduateCommand('dummyOrg', destination, apiKey, apiKey, blacklistOptions);
        command.graduatePages(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
