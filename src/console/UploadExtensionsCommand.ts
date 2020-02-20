import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { ExtensionController } from '../controllers/ExtensionController';

program
  .command('upload-extensions <origin> <apiKey> <filePathToUpload>')
  .description('(beta) Upload extensions to an organization.')
  .option('-E, --ignoreExtensions []', 'Extensions to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((destination: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-extensions');

    FileUtils.readJson(filePathToUpload)
      .then(data => {
        // Set diff options
        const diffOptions: IDiffOptions = {
          silent: options.silent,
          includeOnly: options.onlyKeys,
          originData: data
        };

        // Set graduation options
        const graduateOptions: IGraduateOptions = {
          diffOptions: diffOptions,
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1
        };

        const blacklistOptions = {
          extensions: _.union(
            ['allfieldvalues', 'allfieldsvalue', 'allfieldsvalues', 'allmetadatavalue', 'allmetadatavalues'],
            options.ignoreExtensions
          )
        };
        const originOrg = new Organization('dummyOrg', '', blacklistOptions);
        const destinationOrg = new Organization(destination, apiKey, blacklistOptions);
        const controller: ExtensionController = new ExtensionController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
