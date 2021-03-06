import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';
import { IDownloadOptions } from '../controllers/BaseController';

program
  .command('download-pages <origin> [apiKey]')
  .description('Download the pages of an organization.')
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-F, --downloadOutput <path>', 'The folder path where to store the download output')
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action(async (origin: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'download-pages');
    if (!options.downloadOutput) {
      Logger.error("missing required options '--downloadOutput'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    const organization = new Organization(origin, apiKey, { platformUrl: program.opts()?.platformUrlOrigin });
    const controller: PageController = new PageController(organization);
    const downloadOptions: IDownloadOptions = { outputFolder: options.downloadOutput };

    controller.download(downloadOptions);
  });
