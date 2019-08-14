import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { DownloadCommand } from '../commands/DownloadCommand';

program
  .command('download-pages <origin> <apiKey> <outputFolder>')
  .description('Download the pages of an organization.')
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((origin: string, apiKey: string, outputFolder: string, options: any) => {
    CommanderUtils.setLogger(options, 'download-pages');

    const command = new DownloadCommand(origin, apiKey, outputFolder);
    command.downloadPages();
  });
