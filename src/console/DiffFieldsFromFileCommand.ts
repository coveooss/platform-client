import { union } from 'underscore';
import * as program from 'commander';
import { CommanderUtils } from './CommanderUtils';
import { FileUtils } from '../commons/utils/FileUtils';
import { Logger } from '../commons/logger';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Organization } from '../coveoObjects/Organization';
import { FieldController } from '../controllers/FieldController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('diff-fields-file <org> [apiKey]')
  .description('Compare fields from an organization to a local configuration file')
  .option('-f, --fileToDiff <path>', 'Path to file containing field configuration')
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
  .action(async (org: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'diff-fields-file');
    if (!options.fileToDiff) {
      Logger.error("missing required options '--fileToDiff'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlDestination);
    }

    // Set graduation options
    FileUtils.readJson(options.fileToDiff)
      .then((data) => {
        const diffOptions: IDiffOptions = {
          keysToIgnore: union(options.ignoreKeys, ['sources']),
          includeOnly: options.onlyKeys,
          silent: options.silent,
          originData: data,
        };

        // TODO: find a cleaner way
        const originOrg = new DummyOrganization();
        const destinationOrg = new Organization(org, apiKey, { platformUrl: program.opts()?.platformUrlDestination });
        const controller: FieldController = new FieldController(originOrg, destinationOrg);

        controller.diff(diffOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
