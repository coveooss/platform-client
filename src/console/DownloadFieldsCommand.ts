import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { DownloadCommand } from '../commands/DownloadCommand';

export const DownloadFieldsCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('download-fields <origin> <apiKey> <outputFolder>')
    .description(['Download the fields of an Organization.'])
    .option(
      '-l, --logLevel <level>',
      'Possible values are: insane, verbose, info (default), error, nothing',
      /^(insane|verbose|info|error|nothing)$/i,
      'info'
    )
    .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
    .action((origin: string, apiKey: string, outputFolder: string, options: any) => {
      commanderUtils.setLogger(options, 'download-fields');

      const command = new DownloadCommand(origin, apiKey, outputFolder);
      command.downloadFields();
    });
};
