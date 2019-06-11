import { EnvironmentUtils } from './commons/utils/EnvironmentUtils';
setEnvironmentIfNecessary();

import * as program from 'commander';
import * as _ from 'underscore';
import { CommanderUtils } from './console/CommanderUtils';
import { GraduateExtensionsCommand } from './console/GraduateExtensionsCommand';
import { GraduateSourcesCommand } from './console/GraduateSourcesCommand';
import { DiffSourcesCommand } from './console/DiffSourcesCommand';
import { InteractiveCommand } from './console/InteractiveCommand';
import { DownloadFieldsCommand } from './console/DownloadFieldsCommand';
import { GraduateFieldsCommand } from './console/GraduateFieldsCommand';
import { DiffExtensionsCommand } from './console/DiffExtensionsCommand';
import { DiffFieldsCommand } from './console/DiffFieldsCommand';

const pkg: any = require('./../package.json');
const updateNotifier = require('update-notifier');
updateNotifier({ pkg }).notify();

program
  .option('--env [value]', 'Environment (Production by default. Supported environments are: test|development|qa|production)')
  .version(pkg.version);

const commanderUtils = new CommanderUtils();

InteractiveCommand(program, commanderUtils);

/**************************************************/
/* Graduation commands
/**************************************************/
GraduateFieldsCommand(program, commanderUtils);
GraduateExtensionsCommand(program, commanderUtils);
GraduateSourcesCommand(program, commanderUtils);

/**************************************************/
/* Diff commands
/**************************************************/
DiffFieldsCommand(program, commanderUtils);
DiffExtensionsCommand(program, commanderUtils);
DiffSourcesCommand(program, commanderUtils);

/**************************************************/
/* Download Commands
/**************************************************/
DownloadFieldsCommand(program, commanderUtils);

// Parsing the arguments
program.parse(process.argv);

if (program.args && _.last(program.args)) {
  !program.commands.map((cmd: any) => cmd._name).includes((_.last(program.args) as any)._name) && program.help();
} else {
  console.log('Missing argument');
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
