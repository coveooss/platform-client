import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { Organization } from '../coveoObjects/Organization';
import { IDownloadOptions } from '../controllers/BaseController';
import { ExtensionController } from '../controllers/ExtensionController';

program
  .command('download-extensions <origin> <apiKey> <outputFolder>')
  .description('Download the extensions of an organization.')
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((origin: string, apiKey: string, outputFolder: string, options: any) => {
    CommanderUtils.setLogger(options, 'download-extensions');

    const organization = new Organization(origin, apiKey);
    const controller: ExtensionController = new ExtensionController(organization);
    const downloadOptions: IDownloadOptions = { outputFolder: outputFolder };

    controller.download(downloadOptions);
  });
