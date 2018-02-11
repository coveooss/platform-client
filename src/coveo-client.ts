import { EnvironmentUtils } from './commons/utils/EnvironmentUtils';
setEnvironmentIfNecessary();

import * as inquirer from 'inquirer';
import { GraduateCommand, IGraduateOptions } from './commands/GraduateCommand';
import { InteractionController } from './console/InteractionController';
import { DiffCommand, IDiffOptions } from './commands/DiffCommand';
import { Logger } from './commons/logger';

const program = require('commander');
const pkg: any = require('./../package.json');

program.option('--env [value]', 'Environment (Production by default)').version(pkg.version);

program.on('--help', () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ graduate dev-org prod-org dev-api-key prod-api-key --fields -Ppd');
  console.log('');
});

// Basic Graduation command
program
  // TODO: add a validation function with a meaningful error message if a parameter is missing
  .command('graduate <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description('Graduate one organisation to an other')
  .option('-f, --fields', 'Graduate fields')
  .option('-e, --extensions', 'Graduate extensions')
  .option('-F, --force', 'Force graduation without confirmation prompt')
  .option('-i, --ignoreKeys []', 'Object keys to ignore. String separated by ","', list)
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
  .option(
    '-m, --methods []',
    'HTTP method authorized by the Graduation. Should be a comma separated list (no spaces). Default value is "POST,PUT,DELETE".',
    list,
    ['POST', 'PUT', 'DELETE']
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info (default), error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .action((originOrg: string, destinationOrg: string, originApiKey: string, destinationApiKey: string, options: any) => {
    setLogger(options, 'graduate');

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      diffOptions: {
        keysToIgnore: options.ignoreKeys || [],
        includeOnly: options.onlyKeys || []
      },
      force: !!options.force,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1
    };

    const command = new GraduateCommand(originOrg, destinationOrg, originApiKey, destinationApiKey, graduateOptions);

    if (options.fields) {
      command.graduateFields();
    } else if (options.extensions) {
      command.graduateExtensions();
    } else {
      Logger.warn('Nothing to Graduate.\nSpecify something to graduate. For example: --fields or --extensions');
    }
  });

// Basic Diff command
program
  .command('diff <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description(['Diff 2 Organizations.'])
  .option('-f, --fields', 'Diff fields')
  .option('-e, --extensions', 'Diff extensions')
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option('-i, --ignoreKeys []', 'Object keys to ignore. String separated by ","', list)
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info (default), error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((originOrg: string, destinationOrg: string, originApiKey: string, destinationApiKey: string, options: any) => {
    setLogger(options, 'diff');

    // Set diff options
    const diffOptions: IDiffOptions = {
      keysToIgnore: options.ignoreKeys || [],
      includeOnly: options.onlyKeys || [],
      silent: options.silent
    };

    const command = new DiffCommand(originOrg, destinationOrg, originApiKey, destinationApiKey, diffOptions);
    if (options.fields) {
      command.diffFields();
    } else if (options.extensions) {
      command.diffExtensions();
    } else {
      Logger.warn('Nothing to diff.\nSpecify something to diff. For example: --fields or --extensions');
    }
  });

program
  .command('interactive')
  .description('Launch the application in interactive mode')
  .action(() => {
    const questions = new InteractionController();
    questions.start();
  });

// Parsing the arguments
program.parse(process.argv);

// Utils
function list(val: string) {
  return val.split(',');
}

function setEnvironmentIfNecessary() {
  const i = process.argv.indexOf('--env');
  if (i !== -1 && i + 1 < process.argv.length) {
    const env = process.argv[i + 1];
    EnvironmentUtils.setNodeEnvironment(env);
  } else {
    EnvironmentUtils.setDefaultNodeEnvironment();
  }
}

function setLogger(options: any, command: string) {
  Logger.setLogLevel(options.logLevel);
  Logger.setFilename(options.output);
  Logger.newAction(command);
}
