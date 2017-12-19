setEnvironmentIfNecessary();

import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import { GraduateCommand, IGraduateOptions } from './commands/GraduateCommand';
import { StringUtils } from './commons/utils/StringUtils';
import { InteractiveMode } from './console/InteractiveMode';
import { SettingsController } from './console/SettingsController';
import { FieldController } from './controllers/FieldController';
import { Dictionary } from './commons/collections/Dictionary';
import { Organization } from './coveoObjects/Organization';
import { config } from './config/index';
import { DiffCommand } from './commands/DiffCommand';
import { Logger } from './commons/logger';
import { IDiffOptions } from './commons/utils/DiffUtils';

const program = require('commander');
const pkg: any = require('./../package.json');

program
  .option('--env [value]', 'Environment')
  .version(pkg.version);

program.on('--help', () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ graduate dev-org prod-org dev-api-key prod-api-key --fields -Ppd');
  console.log('');
});

// Basic Graduation command
program
  .command('graduate <originOrganization> <destinationOrganization> <originApiKey> <destinationApiKey>')
  .description('Graduate one organisation to an other')
  .option('-f, --fields', 'Graduate fields')
  .option('-s, --sources', 'Graduate sources')
  .option('-e, --extensions', 'Graduate extensions')
  .option('-F, --force', 'Force graduation without confirmation prompt')
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option('-l, --logLevel <level>', 'Possible values are: insane, verbose, info (default), error, nothing', /^(insane|verbose|info|error|nothing)$/i, 'info')
  .action((originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string, options: any) => {

    setLogger(options);

    // Set graduation options
    const graduateOptions: IGraduateOptions = {
      force: !!options.force
    };

    let command = new GraduateCommand(originOrganization, destinationOrganization, originApiKey, destinationApiKey, graduateOptions);

    if (options.fields) {
      command.graduateFields();
    }
    if (options.sources) {
      command.graduateSources();
    }
    if (options.extensions) {
      command.graduateExtensions();
    }
  });

// Basic Diff command
program
  .command('diff <originOrganization> <destinationOrganization> <originApiKey> <destinationApiKey>')
  .description('Diff 2 Organizations')
  .option('-f, --fields', 'Diff fields')
  .option('-s, --sources', 'Diff sources')
  .option('-e, --extensions', 'Diff extensions')
  .option('-b, --openInBrowser', 'Open Diff in default Browser')
  .option('-i, --ignoreKeys []', 'Object keys to ignore. String separated by ","', list)
  .option('-o, --onlyKeys []', 'Diff only the specified keys. String separated by ","', list)
  .option('-l, --logLevel <level>', 'Possible values are: insane, verbose, info (default), error, nothing', /^(insane|verbose|info|error|nothing)$/i, 'info')
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .action((originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string, options: any) => {

    setLogger(options);
    // Set diff options
    const diffOptions: IDiffOptions = {
      keysToIgnore: options.ignoreKeys || [],
      includeOnly: options.onlyKeys || []
    };

    let command = new DiffCommand(originOrganization, destinationOrganization, originApiKey, destinationApiKey, diffOptions);
    if (options.fields) {
      command.diffFields();
    }
    if (options.extensions) {
      command.diffExtensions();
    }
  });

program
  .command('init')
  .description('Launch interactive setting')
  .action(() => {
    let interactiveMode = new InteractiveMode();
    interactiveMode.start()
      .then((answers: inquirer.Answers) => {
        let settingFilename = answers[InteractiveMode.SETTING_FILENAME];
        let settings = SettingsController.genSettings(answers);
        // Saving settings into a file
        fs.writeJSON(settingFilename, settings, { spaces: 2 })
          .then(() => {
            Logger.info('File Saved');
          }).catch((err: any) => {
            Logger.error('Unable to save setting file', err);
          });
      })
      .catch((err: any) => {
        Logger.error('Error in interactive mode', err);
      });
  });

program
  // Currently loads the file from current directory
  .command('loadSettings <filename>')
  .description('Execute commande from json file')
  .action((filename: string) => {
    fs.readJson(filename)
      .then((settings: any) => {
        Logger.info('To complete');
      })
      .catch((err: any) => {
        Logger.error(err);
      });
  });

program.parse(process.argv);

// Utils
function list(val: string) {
  return val.split(',');
}

function setEnvironmentIfNecessary() {
  let i = process.argv.indexOf('--env');
  if (i !== -1 && i + 1 < process.argv.length) {
    let env = process.argv[i + 1];
    process.env.NODE_ENV = env;
  }
}

function setLogger(options: any) {
  Logger.setLogLevel(options.logLevel);
  Logger.setFilename(options.output);
  Logger.newAction(options.parent.rawArgs.splice(2).join(' '));
}
