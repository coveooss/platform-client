import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { SourceController } from '../controllers/SourceController';
import { Organization } from '../coveoObjects/Organization';
import { IDownloadOptions } from '../controllers/BaseController';

program
  .command('download-sources <origin> [apiKey]')
  .description('Download the sources of an organization.')
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-F, --downloadOutput <path>', 'The folder path where to store the download output')
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action(async (origin: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'download-sources');
    if (!options.downloadOutput) {
      Logger.error("missing required options '--downloadOutput'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    const organization = new Organization(origin, apiKey, { platformUrl: program.opts()?.platformUrlOrigin });
    const controller: SourceController = new SourceController(organization);
    const downloadOptions: IDownloadOptions = { outputFolder: options.downloadOutput };

    controller.download(downloadOptions);
  });
