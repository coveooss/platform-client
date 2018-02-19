import { EnvironmentUtils } from './commons/utils/EnvironmentUtils';
setEnvironmentIfNecessary();

import * as inquirer from 'inquirer';
import { GraduateCommand, IGraduateOptions } from './commands/GraduateCommand';
import { InteractionController } from './console/InteractionController';
import { DiffCommand, IDiffOptions } from './commands/DiffCommand';
import { DownloadCommand } from './commands/DownloadCommand';
import { Logger } from './commons/logger';

const program = require('commander');
const pkg: any = require('./../package.json');

program.option('--env [value]', 'Environment (Production by default)').version(pkg.version);

// Graduate Fields
program
  .command('graduate-fields <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description('Graduate one organisation to an other')
  .option('-F, --force', 'Force graduation without confirmation prompt')
  .option('-i, --ignoreKeys []', 'Keys to ignore. String separated by ",". This option has no effect when diffing extensions', list)
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
        keysToIgnore: options.ignoreKeys,
        includeOnly: options.onlyKeys
      },
      force: options.force,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1
    };

    const command = new GraduateCommand(originOrg, destinationOrg, originApiKey, destinationApiKey);
    command.graduateFields(graduateOptions);
  });

program
  .command('graduate-extensions <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description('Graduate one organisation to an other')
  .option('-F, --force', 'Force graduation without confirmation prompt')
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
  .option('-m, --methods []', 'HTTP method authorized by the Graduation. Currently, only "POST" method is allowed for extensions.', list, [
    'POST'
  ])
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
        keysToIgnore: options.ignoreKeys,
        includeOnly: options.onlyKeys
      },
      force: options.force,
      POST: options.methods.indexOf('POST') > -1,
      PUT: false,
      DELETE: false
    };

    const command = new GraduateCommand(originOrg, destinationOrg, originApiKey, destinationApiKey);
    command.graduateExtensions(graduateOptions);
  });

// Diff Fields
program
  .command('diff-fields <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description(['Diff the fields of 2 Organizations.'])
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option('-i, --ignoreKeys []', 'Keys to ignore. String separated by ",".', list)
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info (default), error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((originOrg: string, destinationOrg: string, originApiKey: string, destinationApiKey: string, options: any) => {
    setLogger(options, 'diff-fields');

    // Set diff options
    const diffOptions: IDiffOptions = {
      keysToIgnore: options.ignoreKeys,
      includeOnly: options.onlyKeys,
      silent: options.silent
    };

    const command = new DiffCommand(originOrg, destinationOrg, originApiKey, destinationApiKey);
    command.diffFields(diffOptions);
  });

// Diff Extensions
program
  .command('diff-extensions <originOrg> <destinationOrg> <originApiKey> <destinationApiKey>')
  .description(['Diff the extensions of 2 Organizations.'])
  .option('-s, --silent', 'Do not open the diff result once the operation has complete', false)
  .option(
    '-o, --onlyKeys []',
    'Diff only the specified keys. String separated by ",". By default, the extension diff will ignore the following keys: "requiredDataStreams", "content", "description" and "name"',
    list
  )
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info (default), error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((originOrg: string, destinationOrg: string, originApiKey: string, destinationApiKey: string, options: any) => {
    setLogger(options, 'diff-extensions');

    // Set diff options
    const diffOptions: IDiffOptions = {
      includeOnly: options.onlyKeys,
      silent: options.silent
    };

    const command = new DiffCommand(originOrg, destinationOrg, originApiKey, destinationApiKey);
    diffOptions.includeOnly = diffOptions.includeOnly ? diffOptions.includeOnly : ['requiredDataStreams', 'content', 'description', 'name'];
    command.diffExtensions(diffOptions);
  });

// Download Fields
program
  .command('download-fields <originOrg> <originApiKey> <outputFolder>')
  .description(['Download the fields of an Organization.'])
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info (default), error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((originOrg: string, originApiKey: string, outputFolder: string, options: any) => {
    setLogger(options, 'download-fields');

    const command = new DownloadCommand(originOrg, originApiKey, outputFolder);
    command.downloadFields();
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
