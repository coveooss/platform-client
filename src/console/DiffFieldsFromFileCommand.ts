import { union } from 'underscore';
import * as program from 'commander';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Logger } from '../commons/logger';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';

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
      .then((data) => {
        const diffOptions: IDiffOptions = {
          keysToIgnore: union(options.ignoreKeys, ['sources']),
          includeOnly: options.onlyKeys,
          silent: options.silent,
          originData: data,
        };

        // TODO: find a cleaner way
        const originOrg = new Organization('localFile', '');
        const destinationOrg = new Organization(org, apiKey, { platformUrl: options?.platformUrlDestination });
        const controller: FieldController = new FieldController(originOrg, destinationOrg);

        controller.diff(diffOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
