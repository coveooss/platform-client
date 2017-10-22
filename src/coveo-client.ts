import { GraduateCommand } from './commands/GraduateCommand';
import { StringUtils } from './commons/utils/StringUtils';
import { config } from './config/index';
import { Logger } from './commons/logger';
import { InteractiveMode, IAnswer } from './console/InteractiveMode';
import * as inquirer from 'inquirer';
import * as fs from 'fs-extra';
const program = require('commander');
const pkg: any = require('./../package.json');
const prompt = inquirer.createPromptModule();

Logger.info(`Environment: ${config.env}\n`);

// function setEnvironment(env: string) { }

program
  // TODO set Environment
  // .option('--env [value]', 'Environment', setEnvironment)
  .version(pkg.version)

// Basic Graduation command
program
  .command('graduate <originOrganization> <destinationOrganization> <originApiKey> <destinationApiKey>')
  .description('Graduate one organisation to an other')
  .option('-f, --fields', 'Graduate fields')
  .option('-s, --sources', 'Graduate sources')
  .option('-e, --extensions', 'Graduate extensions')
  .option('-u, --update', 'Graduate updated data only')
  .option('-d, --delete', 'Only delete data that is no longer in the origin Organization')
  .option('-c, --create', 'Only create data that is not existing in the destination Organization')
  .action((originOrganization: string, destinationOrganization: string, originApiKey: string, destinationApiKey: string, options: any) => {
    let command = new GraduateCommand(originOrganization, destinationOrganization, originApiKey, destinationApiKey);

    if (options.fields) {
      command.graduateFields()
    }
    if (options.sources) {
      command.graduateSources()
    }
    if (options.extensions) {
      command.graduateExtensions()
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
        let settings = interactiveMode.genSettings(answers);
        // Saving settings into a file
        fs.writeJSON(fileName, settings, { spaces: 2 })
          .then(() => {
            Logger.info('File Saved');
          }).catch((err: any) => {
            Logger.error('Unable to save setting file', err)
          })
      })
      .catch((err: any) => {
        Logger.error('Error in interactive mode', err)
      })
  });

program
  // Currently loads the file from current directory
  .command('loadSettings <filePath>')
  .description('Execute commande from json file')
  .action((filename: string) => {
  });


program.parse(process.argv);
