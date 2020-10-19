import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';
import { isArray } from 'underscore';

program
  .command('diff-pages <origin> <destination> [apiKey...]')
  .description('Diff the pages of 2 organizations')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action(async (origin: string, destination: string, apiKey: string[], options: any) => {
    CommanderUtils.setLogger(options, 'diff-pages');
    if (isArray(apiKey) && apiKey.length === 0) {
      apiKey[0] = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    const includeOnly = [
      'name', // mandatory
      'title', // mandatory
      'html',
    ];

    // Set diff options
    const diffOptions: IDiffOptions = {
      silent: options.silent,
      includeOnly: includeOnly,
    };

    const blacklistOptions = {
      pages: options.ignorePages,
    };

    const originOrg = new Organization(origin, apiKey[0], { blacklist: blacklistOptions, platformUrl: program.opts()?.platformUrlOrigin });
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], {
      blacklist: blacklistOptions,
      platformUrl: program.opts()?.platformUrlDestination,
    });
    const controller: PageController = new PageController(originOrg, destinationOrg);

    controller.diff(diffOptions);
  });
