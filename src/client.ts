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
  .option('--env [value]', 'Environment (Production by default. Supported environments are: development|qa|production)')
  .version(pkg.version);

/**************************************************/
/* Interactive commands
/**************************************************/
import './console/InteractiveCommand';

/**************************************************/
/* Diff commands
/**************************************************/
import './console/DiffFieldsCommand';
import './console/DiffExtensionsCommand';
import './console/DiffSourcesCommand';
import './console/DiffPagesCommand';

/**************************************************/
/* Diff From Local File commands
/**************************************************/
import './console/DiffFieldsFromFileCommand';
// TODO: import './console/DiffExtensionsFromFileCommand';
// TODO: import './console/DiffSourcesFromFileCommand';
import './console/DiffPagesFromFileCommand';

/**************************************************/
/* Graduation commands
/**************************************************/
import './console/GraduateFieldsCommand';
import './console/GraduateExtensionsCommand';
import './console/GraduateSourcesCommand';
import './console/GraduatePagesCommand';

/**************************************************/
/* Download Commands
/**************************************************/
import './console/DownloadFieldsCommand';
import './console/DownloadExtensionsCommand';
import './console/DownloadSourcesCommand';
import './console/DownloadPagesCommand';

/**************************************************/
/* Upload Commands
/**************************************************/
import './console/UploadFieldsCommand';
import './console/UploadExtensionsCommand';
import './console/UploadSourcesCommand';
import './console/UploadPagesCommand';

/**************************************************/
/* Source Commands
/**************************************************/
import './console/RebuildSourcesCommand';

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
