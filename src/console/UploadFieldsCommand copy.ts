import * as _ from 'underscore';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Logger } from '../commons/logger';
import { IDiffOptions, DiffCommand } from '../commands/DiffCommand';

export const DiffFieldsFromFileCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('diff-fields-file <org> <apiKey> <filePathToUpload>')
    .description('Compare fields from an organization to a local file configuration')
    .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
    .option('-i, --ignoreKeys []', 'Keys to ignore.', commanderUtils.list, [])
    .option('-o, --onlyKeys []', 'Diff only the specified keys.', commanderUtils.list, [])
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info, error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((org: string, apiKey: string, filePathToUpload: string, options: any) => {
      commanderUtils.setLogger(options, 'upload-fields');

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
          const command = new DiffCommand('dummyOrg', org, apiKey, apiKey);
          command.diffFields(diffOptions);
        })
        .catch((err: any) => {
          Logger.error('Unable to read file', err);
          process.exit();
        });
    });
};
