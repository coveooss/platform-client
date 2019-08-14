import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { DownloadCommand } from '../commands/DownloadCommand';

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

    const command = new DownloadCommand(origin, apiKey, outputFolder);
    command.downloadExtensions();
  });
