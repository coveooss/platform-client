// TODO: set log file output before setting env
setEnvironmentIfNecessary();

import { GraduateCommand } from './commands/GraduateCommand';
import { StringUtils } from './commons/utils/StringUtils';
import { Logger } from './commons/logger';
import { InteractiveMode, IAnswer } from './console/InteractiveMode';
import { SettingsController } from './console/SettingsController';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
import { FieldController } from './controllers/FieldController';
import { IDiffResult } from './commons/interfaces/IDiffResult';
import { Dictionary } from './commons/collections/Dictionary';
import { Organization } from './models/OrganizationModel';
import { config } from './config/index';
import { DiffCommand } from './commands/DiffCommand';

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
  .option('-P, --POST', 'Allow POST operations on the destination Organization')
  .option('-p, --PUT', 'Allow PUT operations on the destination Organization')
  .option('-d, --DELETE', 'Allow DELETE operations on the destination Organization')
  .option('-o, --output <filename>', 'Output log data into a specific filename', Logger.filename)
  .option('-l, --logLevel <level>', 'Possible values are: verbose, info (default), error, nothing', /^(verbose|info|error|nothing)$/i, 'info')
  .action((originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string, options: any) => {

    // Set Logger
    Logger.setLogLevel(options.logLevel);
    Logger.setFilename(options.output);
    Logger.newAction('Graduate');

    let command = new GraduateCommand(originOrganization, destinationOrganization, originApiKey, destinationApiKey);

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
  .option('-i, --ignoreFields', 'Fields to ignore', [])
  // .option('-o, --outputfile', 'Output file', `${config.workingDirectory}output/diff-${Date.now()}.html`)
  .action((originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string, options: any) => {
    let command = new DiffCommand(originOrganization, destinationOrganization, originApiKey, destinationApiKey);
    if (options.fields) {
      command.diffFields();
    }
  });

program
  .command('init')
  .description('Launch interactive setting')
  .action(() => {
    let interactiveMode = new InteractiveMode();
    interactiveMode.start()
      .then((answers: IAnswer) => {
        let fileName = answers.filename;
        let settings = SettingsController.genSettings(answers);
        // Saving settings into a file
        fs.writeJSON(fileName, settings, { spaces: 2 })
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
function setEnvironmentIfNecessary() {
  let i = process.argv.indexOf('--env');
  if (i !== -1 && i + 1 < process.argv.length) {
    let env = process.argv[i + 1];
    process.env.NODE_ENV = env;
  }
}
