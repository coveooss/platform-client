import * as program from 'commander';
import {} from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';

program
  .command('diff-pages-file <org> <apiKey> <filePathToUpload>')
  .description('Compare pages from an organization to a local configuration file')
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
  .action((org: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'diff-pages-file');

    FileUtils.readJson(filePathToUpload)
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

        const originOrg = new Organization('localFile', '', { blacklist: blacklistOptions });
        const destinationOrg = new Organization(org, apiKey, { blacklist: blacklistOptions, platformUrl: options?.platformUrlDestination });
        const controller: PageController = new PageController(originOrg, destinationOrg);

        controller.diff(diffOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
