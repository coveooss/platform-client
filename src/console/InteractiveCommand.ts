import * as program from 'commander';
import { InteractionController } from './InteractionController';

program
  .command('interactive')
  .description('Launch the application in interactive mode')
  .action(() => {
    const questions = new InteractionController();
    questions.start();
  });
