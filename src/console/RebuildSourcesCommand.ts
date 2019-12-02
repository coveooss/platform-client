import * as inquirer from 'inquirer';
import * as program from 'commander';
import * as _ from 'underscore';
import { Logger } from '../commons/logger';
import { CommanderUtils } from './CommanderUtils';
import { Organization } from '../coveoObjects/Organization';
import { SourceController } from '../controllers/SourceController';
import { InteractiveQuestion } from './InteractiveQuestion';

program
  .command('rebuild-sources <origin> <apiKey>')
  .description('Rebuild sources within an organization.')
  .option('-s, --sources []', 'List of sources to rebuild. String separated by ",".', CommanderUtils.list)
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
  .action((origin: string, apiKey: string, options: any) => {
    // CommanderUtils.setLogger(options, 'rebuild-sources');

    const organization = new Organization(origin, apiKey);
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
          const massRebuild = Promise.all(
            _.map(options.sources, (sourceName: string) => {
              sourceController.rebuildSource(sourceName);
            })
          );
          massRebuild
            .then(() => {
              Logger.info('Rebuild operation completed');
              Logger.stopSpinner();
            })
            .catch((err: any) => {
              Logger.error(err);
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
