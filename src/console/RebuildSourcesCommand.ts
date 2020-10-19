import * as inquirer from 'inquirer';
import * as program from 'commander';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';
import { InteractiveQuestion } from './InteractiveQuestion';
import { StaticErrorMessage } from '../commons/errors';

program
  .command('rebuild-sources <origin> [apiKey]')
  .description('Rebuild sources within an organization.')
  .option('-s, --sources []', 'List of sources to rebuild. String separated by ",".', CommanderUtils.list)
  .option('-O, --output <filename>', 'Output log data into a specific filename', Logger.getFilename())
  .option(
    '-l, --logLevel <level>',
    'Possible values are: insane, verbose, info, error, nothing',
    /^(insane|verbose|info|error|nothing)$/i,
    'info'
  )
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ platformclient rebuild-sources --help');
    console.log('  $ platformclient rebuild-sources devOrg apiKey "source A,source B"');
  })
  .action(async (origin: string, apiKey: string, options: any) => {
    CommanderUtils.setLogger(options, 'rebuild-sources');
    if (!apiKey) {
      apiKey = await CommanderUtils.getAccessTokenFromLogingPopup(program.opts()?.platformUrlOrigin);
    }

    const organization = new Organization(origin, apiKey, { platformUrl: program.opts()?.platformUrlOrigin });
    const sourceController = new SourceController(organization);

    if (options.sources && options.sources.length > 0) {
      const interactiveQuestion = new InteractiveQuestion();
      const questions = [];

      questions.push(
        interactiveQuestion.confirmAction(
          `Are you sure you want to rebuild these source${options.sources.length > 1 ? 's' : ''}: ${options.sources.join(', ')}`,
          'confirm'
        )
      );

      inquirer.prompt(questions).then((res: inquirer.Answers) => {
        if (res.confirm) {
          Logger.startSpinner(`Rebuilding source${options.sources.length > 1 ? 's' : ''}`);
          Promise.all(options.sources.map((sourceName: string) => sourceController.rebuildSource(sourceName)))
            .then((response) => {
              Logger.info(`Rebuild operation${response.length > 0 ? 's' : ''} has been added to the queue`);
              Logger.stopSpinner();
            })
            .catch((err: any) => {
              Logger.error(StaticErrorMessage.UNABLE_TO_REBUILD_SOURCE);
              Logger.stopSpinner();
            });
        } else {
          Logger.info(`Rebuilding operation canceled`);
          Logger.stopSpinner();
        }
      });
    } else {
      Logger.error('Please specify at least one source to rebuild using the parameter "-s"');
    }
  });
