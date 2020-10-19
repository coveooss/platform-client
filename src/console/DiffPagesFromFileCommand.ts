import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('diff-pages-file <org> [apiKey]')
  .description('Compare pages from an organization to a local configuration file')
  .option('-f, --fileToDiff <path>', 'Path to file containing page configuration')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
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
    console.log('  $ platformclient diff-pages-file --help');
    console.log('  $ platformclient diff-pages-file YourOrg YourApiKey FileToCompare');
  })
  .action(async (org: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'diff-pages-file');
    if (!options.fileToDiff) {
      Logger.error("missing required options '--fileToDiff'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlDestination);
    }

    FileUtils.readJson(options.fileToDiff)
      .then((data) => {
        const includeOnly = [
          'name', // mandatory
          'title', // mandatory
          'html',
        ];

        // Set diff options
        const diffOptions: IDiffOptions = {
          silent: options.silent,
          includeOnly: includeOnly,
          originData: data,
        };

        const blacklistOptions = {
          pages: options.ignorePages,
        };

        const originOrg = new DummyOrganization();
        const destinationOrg = new Organization(org, apiKey, {
          blacklist: blacklistOptions,
          platformUrl: program.opts()?.platformUrlDestination,
        });
        const controller: PageController = new PageController(originOrg, destinationOrg);

        controller.diff(diffOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
