import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { SourceController } from '../controllers/SourceController';
import { Organization, IOrganizationOptions } from '../coveoObjects/Organization';
import { IDownloadOptions } from '../controllers/BaseController';

program
  .command('download-sources <origin> [apiKey]')
  .description('Download the sources of an organization.')
  .option(
    '-S, --sources []',
    'List of sources to download. If not specified all sources will be downlaoded. Source names should be separated by a comma',
    CommanderUtils.list,
    []
  )
  .option(
    '--ignoreSources []',
    'List of sources to ignore. If no specified, all the sources will be downloaded. Source names should be separated by a comma',
    CommanderUtils.list,
    []
  )
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

    const orgOptions: IOrganizationOptions = {
      platformUrl: program.opts()?.platformUrlOrigin,
    };
    if (options.ignoreSources.length > 0) {
      orgOptions.blacklist = { sources: options.ignoreSources };
    }
    if (options.sources.length > 0) {
      orgOptions.whitelist = { sources: options.sources };
    }
    if (options.ignoreSources.length > 0 && options.sources.length > 0) {
      Logger.error('Cannot specify both --sources and --ignoreSources options. Choose one or the other');
      process.exit();
    }

    const organization = new Organization(origin, apiKey, orgOptions);

    const controller: SourceController = new SourceController(organization);
    const downloadOptions: IDownloadOptions = { outputFolder: options.downloadOutput };

    controller.download(downloadOptions);
  });
