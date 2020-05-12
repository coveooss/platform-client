import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { IGraduateOptions } from '../commons/interfaces/IGraduateOptions';
import { CommanderUtils } from './CommanderUtils';
import { IDiffOptions } from '../commons/interfaces/IDiffOptions';
import { Organization } from '../coveoObjects/Organization';
import { PageController } from '../controllers/PageController';

program
  .command('graduate-pages <origin> <destination> <apiKey...>')
  .description('Graduate pages from one organization to another')
  .option('-E, --ignorePages []', 'Pages to ignore. String separated by ",".', CommanderUtils.list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation', CommanderUtils.list, ['POST', 'PUT'])
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((origin: string, destination: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'graduate-pages');

    const includeOnly = [
      'name', // mandatory
      'title', // mandatory
      'html'
    ];

    // Set diff options
    const diffOptions: IDiffOptions = {
      silent: options.silent,
      includeOnly: includeOnly
    };

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      diffOptions: diffOptions,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1
    };

    const blacklistOptions = {
      pages: options.ignorePages
    };

    const originOrg = new Organization(origin, apiKey[0], blacklistOptions);
    const destinationOrg = new Organization(destination, apiKey[apiKey.length > 1 ? 1 : 0], blacklistOptions);
    const controller: PageController = new PageController(originOrg, destinationOrg);

    controller.graduate(graduateOptions);
  });
