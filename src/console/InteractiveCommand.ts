import { CommanderUtils } from './CommanderUtils';
import { InteractionController } from './InteractionController';

export const InteractiveCommand = (program: any, commanderUtils: CommanderUtils) => {
  program
    .command('interactive')
    .description('Launch the application in interactive mode')
    .action(() => {
      const questions = new InteractionController();
      questions.start();
    });
};
