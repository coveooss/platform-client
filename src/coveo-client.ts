import { EnvironmentUtils } from './commons/utils/EnvironmentUtils';
setEnvironmentIfNecessary();

import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import { GraduateCommand, IGraduateOptions } from './commands/GraduateCommand';
import { InteractiveMode } from './console/InteractiveMode';
import { SettingsController } from './console/SettingsController';
import { DiffCommand, IDiffOptions } from './commands/DiffCommand';
import { Logger } from './commons/logger';

const program = require('commander');
const pkg: any = require('./../package.json');

program.option('--env [value]', 'Environment').version(pkg.version);

program.on('--help', () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ graduate dev-org prod-org dev-api-key prod-api-key --fields -Ppd');
  console.log('');
});

// Basic Graduation command
program
  // TODO: add the fiel field or extension in the command line and not in the options
  // TODO: add a validation function with a meaningful error message if a parameter is missing
  .command('graduate <operation> <org1> <org2> <apiKey1> <apiKey2>')
  .description('Graduate one organisation to an other')
  .option('-f, --fields', 'Graduate fields') // TODO: put in the command line
  .option('-e, --extensions', 'Graduate extensions') // TODO: put in the command line
  .option('-F, --force', 'Force graduation without confirmation prompt')
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
  .action((operation: string, org1: string, org2: string, apiKey1: string, apiKey2: string, options: any) => {
    setLogger(options, 'graduate');

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      force: !!options.force,
      POST: options.methods.indexOf('POST') > -1,
      PUT: options.methods.indexOf('PUT') > -1,
      DELETE: options.methods.indexOf('DELETE') > -1
    };

    const command = new GraduateCommand(org1, org2, apiKey1, apiKey2, graduateOptions);

    switch (operation) {
      case 'field':
        command.graduateFields();
        break;
      case 'extension':
        command.graduateExtensions();
        break;
      default:
        console.log('\n  error: Invalid Graduate operation. Here are the available Graduate operations: field, extension.\n');
        break;
    }
  });

// Basic Diff command
program
  .command('diff <operation> <org1> <org2> <apiKey1> <apiKey2>')
  .description(['Diff 2 Organizations.'])
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
  .action((operation: string, org1: string, org2: string, apiKey1: string, apiKey2: string, options: any) => {
    setLogger(options, 'diff');

    // Set diff options
    const diffOptions: IDiffOptions = {
      keysToIgnore: options.ignoreKeys || [],
      includeOnly: options.onlyKeys || [],
      silent: options.silent
    };

    const command = new DiffCommand(org1, org2, apiKey1, apiKey2, diffOptions);
    switch (operation) {
      case 'field':
        command.diffFields();
        break;
      case 'extension':
        command.diffExtensions();
        break;
      default:
        console.log('\n  error: Invalid Diff operation. Here are the available Diff operations: field, extension.\n');
        break;
    }
  });

program
  .command('interactive')
  .description('Launch the interactive client')
  .action(() => {
    const interactiveMode = new InteractiveMode();
    interactiveMode
      .start()
      .then((answers: inquirer.Answers) => {
        const settingFilename = answers[InteractiveMode.SETTING_FILENAME];
        const settings = SettingsController.genSettings(answers);
        // Saving settings into a file
        fs
          .writeJSON(settingFilename, settings, { spaces: 2 })
          .then(() => {
            Logger.info('File Saved');
          })
          .catch((err: any) => {
            Logger.error('Unable to save setting file', err);
          });
      })
      .catch((err: any) => {
        Logger.error('Error in interactive mode', err);
      });
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
  console.log(`Application running in ${EnvironmentUtils.getNodeEnvironment()}`);
}

function setLogger(options: any, command: string) {
  Logger.setLogLevel(options.logLevel);
  Logger.setFilename(options.output);
  Logger.newAction(command);
}
