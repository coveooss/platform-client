import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { SourceController } from '../controllers/SourceController';
import { Organization } from '../coveoObjects/Organization';
import { IDownloadOptions } from '../controllers/BaseController';

program
  .command('download-sources <origin> <apiKey> <outputFolder>')
  .description('Download the sources of an organization.')
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((origin: string, apiKey: string, outputFolder: string, options: any) => {
    CommanderUtils.setLogger(options, 'download-sources');

    const organization = new Organization(origin, apiKey, { platformUrl: options?.platformUrlOrigin });
    const controller: SourceController = new SourceController(organization);
    const downloadOptions: IDownloadOptions = { outputFolder: outputFolder };

    controller.download(downloadOptions);
  });
