import * as _ from 'underscore';
import * as program from 'commander';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Logger } from '../commons/logger';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';

program
  .command('diff-fields-file <org> <apiKey> <filePathToUpload>')
  .description('Compare fields from an organization to a local configuration file')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option('-i, --ignoreKeys []', 'Keys to ignore.', CommanderUtils.list, [])
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
    console.log('  $ platformclient diff-fields-file --help');
    console.log('  $ platformclient diff-fields-file YourOrg YourApiKey FileToCompare');
  })
  .action((org: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'diff-fields-file');

    // Set graduation options
    FileUtils.readJson(filePathToUpload)
      .then(data => {
        const diffOptions: IDiffOptions = {
          keysToIgnore: _.union(options.ignoreKeys, ['sources']),
          includeOnly: options.onlyKeys,
          silent: options.silent,
          originData: data
        };

        // TODO: find a cleaner way
        const command = new DiffCommand('localFile', org, apiKey, apiKey);
        command.diffFields(diffOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
