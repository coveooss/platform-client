import * as program from 'commander';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('upload-pages <origin> [apiKey]')
  .description('Upload pages to an organization.')
  .option(
    '-t, --silent',
    'When specified, the graduation will not ask for user confirmation. Useful when the operation is running in an automated process',
    false
  )
  .option('-f, --fileToUpload <path>', 'Path to file containing field configuration')
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action(async (destination: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-pages');
    if (!options.fileToUpload) {
      Logger.error("missing required options '--fileToUpload'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlDestination);
    }

    FileUtils.readJson(options.fileToUpload)
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

        // Set graduation options
        const graduateOptions: IGraduateOptions = {
          diffOptions: diffOptions,
          silent: options.silent,
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1,
        };

        const blacklistOptions = {
          pages: options.ignorePages,
        };
        const originOrg = new DummyOrganization();
        const destinationOrg = new Organization(destination, apiKey, {
          blacklist: blacklistOptions,
          platformUrl: program.opts()?.platformUrlDestination,
        });
        const controller: PageController = new PageController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
