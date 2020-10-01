import * as program from 'commander';
import { union } from 'underscore';
import { CommanderUtils } from './CommanderUtils';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { FileUtils } from '../commons/utils/FileUtils';
import { Logger } from '../commons/logger';
import { FieldController } from '../controllers/FieldController';
import { Organization } from '../coveoObjects/Organization';

program
  .command('upload-fields <origin> <apiKey> <filePathToUpload>')
  .description('(beta) Upload fields to an organization.')
  .option('-i, --ignoreKeys []', 'Keys to ignore. String separated by ","', CommanderUtils.list, [])
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', CommanderUtils.list, [])
  .option(
    '-S, --sources []',
    'If specified, the operation will only graduate fields that are associated to specified sources.',
    CommanderUtils.list,
    []
  )
  .option(
    '-m, --methods []',
    'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces)',
    CommanderUtils.list,
    ['POST', 'PUT']
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((destination: string, apiKey: string, filePathToUpload: string, options: any) => {
    CommanderUtils.setLogger(options, 'upload-fields');

    // Set graduation options
    FileUtils.readJson(filePathToUpload)
      .then((data) => {
        const graduateOptions: IGraduateOptions = {
          diffOptions: {
            keysToIgnore: union(options.ignoreKeys, ['sources']),
            includeOnly: options.onlyKeys,
            silent: options.silent,
            sources: options.sources,
            originData: data,
          },
          keyBlacklist: union(options.ignoreKeys, ['sources']),
          POST: options.methods.indexOf('POST') > -1,
          PUT: options.methods.indexOf('PUT') > -1,
          DELETE: options.methods.indexOf('DELETE') > -1,
        };

        const originOrg = new Organization('dummyOrg', '');
        const destinationOrg = new Organization(destination, apiKey);
        const controller: FieldController = new FieldController(originOrg, destinationOrg);

        controller.graduate(graduateOptions);
      })
      .catch((err: any) => {
        Logger.error('Unable to read file', err);
        process.exit();
      });
  });
