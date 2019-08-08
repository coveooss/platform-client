import * as program from 'commander';
import * as _ from 'underscore';

// It is important to first set the environment
import { EnvironmentUtils } from './commons/utils/EnvironmentUtils';
setEnvironmentIfNecessary();
import { InteractionController } from './console/InteractionController';

// Setup notification updates in case of a new version
const pkg: any = require('./../package.json');
const updateNotifier = require('update-notifier');
updateNotifier({ pkg }).notify();

program
  .option('--env [value]', 'Environment (Production by default. Supported environments are: test|development|qa|production)')
  .version(pkg.version);

/**************************************************/
/* Interactive commands
/**************************************************/
import './console/InteractiveCommand';

/**************************************************/
/* Graduation commands
/**************************************************/
import './console/GraduateExtensionsCommand';
import './console/GraduateSourcesCommand';
import './console/GraduatePagesCommand';
import './console/GraduateFieldsCommand';

/**************************************************/
/* Diff commands
/**************************************************/
import './console/DiffSourcesCommand';
import './console/DiffExtensionsCommand';
import './console/DiffPagesCommand';
import './console/DiffFieldsCommand';

/**************************************************/
/* Diff From Local File commands
/**************************************************/
import './console/DiffFieldsFromFileCommand';

/**************************************************/
/* Download Commands
/**************************************************/
import './console/DownloadFieldsCommand';
import './console/DownloadSourcesCommand';
import './console/DownloadExtensionsCommand';

/**************************************************/
/* Upload Commands
/**************************************************/
import './console/UploadFieldsCommand';

// Handling invalid commands
program.command('*').action(cmd => {
  console.log(`Invalid command "${cmd}"`);
});

// Parsing the arguments
program.parse(process.argv);

// If no command is provided, fallbacking on interactive mode
if (program.args.length < 1) {
  const questions = new InteractionController();
  questions.start();
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
