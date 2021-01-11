import * as program from 'commander';
import { union } from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionController } from '../controllers/ExtensionController';
import { DummyOrganization } from '../coveoObjects/DummyOrganization';

program
  .command('upload-extensions <origin> [apiKey]')
  .description('Upload extensions to an organization.')
  .option(
    '-t, --silent',
    'When specified, the graduation will not ask for user confirmation. Useful when the operation is running in an automated process',
    false
  )
  .option('-f, --fileToUpload <path>', 'Path to file containing extension configuration')
  .option('-E, --ignoreExtensions []', 'Extensions to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action(async (destination: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-extensions');
    if (!options.fileToUpload) {
      Logger.error("missing required options '--fileToUpload'");
      process.exit();
    }

    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlDestination);
    }

    FileUtils.readJson(options.fileToUpload)
      .then((data) => {
        // Set diff options
        const diffOptions: IDiffOptions = {
          silent: options.silent,
          includeOnly: options.onlyKeys,
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
          extensions: union(
            ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
            options.ignoreExtensions
          ),
        };
        const originOrg = new DummyOrganization();
        const destinationOrg = new Organization(destination, apiKey, {
          blacklist: blacklistOptions,
          platformUrl: program.opts()?.platformUrlDestination,
        });
        const controller: ExtensionController = new ExtensionController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
