import { GraduateCommand } from './commands/GraduateCommand';
import { StringUtils } from './commons/utils/StringUtils';
import { config } from './config/index';
import { Logger } from './commons/logger';
const program = require('commander');
const pkg: any = require('./../package.json');

Logger.info(`Environment: ${config.env}\n`);

// function setEnvironment(env: string) { }

program
  // TODO set Environment
  // .option('--env [value]', 'Environment', setEnvironment)
  .version(pkg.version)

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
  .command('initSettings')
  .description('Launch interactive setting')
// .action((json, orgId, sourceId) => { pushDocuments([json], orgId, sourceId) });

program
  .command('loadSettings <filePath>')
  .description('Execute commande from json file')
  .action((filePath: string) => {
    console.log('*********************');
    console.log(filePath);
    console.log('*********************');

  });


program.parse(process.argv);
