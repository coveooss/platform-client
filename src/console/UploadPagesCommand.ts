import * as program from 'commander';
import {} from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';

program
  .command('upload-pages <origin> <apiKey> <filePathToUpload>')
  .description('(beta) Upload pages to an organization.')
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((destination: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-pages');

    FileUtils.readJson(filePathToUpload)
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
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1,
        };

        const blacklistOptions = {
          pages: options.ignorePages,
        };
        const originOrg = new Organization('dummyOrg', '', blacklistOptions);
        const destinationOrg = new Organization(destination, apiKey, blacklistOptions);
        const controller: PageController = new PageController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
