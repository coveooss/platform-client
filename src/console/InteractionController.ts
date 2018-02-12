import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { Answers } from 'inquirer';
import { InteractiveQuestion } from './InteractiveQuestion';
import { Logger } from '../commons/logger';
import { Utils } from '../commons/utils/Utils';
import { Colors } from '../commons/colors';

export interface ISourceContentSettingOptions {
  configuration: boolean;
  objects: boolean;
  mapping: boolean;
  extensions: boolean;
}

export class InteractionController {
  private questions: InteractiveQuestion;

  constructor() {
    this.questions = new InteractiveQuestion();
  }

  public start() {
    this.questions
      .start()
      .then((answers: Answers) => {
        const commandFilename = answers[InteractiveQuestion.SETTING_FILENAME];
        const command = ['node ' + this.getApplicationFilename(), this.generateCommand(answers)].join(' ');
        fs
          .writeFile(commandFilename, [this.setShebangLine(), command].join('\n'))
          .then(() => {
            console.log(`Intruction saved in ${Colors.filename(commandFilename)}`);
          })
          .catch((err: any) => {
            Logger.error('Unable to save command', err);
          });
      })
      .catch((err: any) => {
        Logger.error('Error in interactive mode', err);
      });
  }

  public generateCommand(answers: Answers) {
    let command: string[] = [];

    // Required parameters
    command.push(answers[InteractiveQuestion.COMMAND]);
    command.push(answers[InteractiveQuestion.ORIGIN_ORG_ID]);
    command.push(answers[InteractiveQuestion.DESTINATION_ORG_ID]);
    command.push(answers[InteractiveQuestion.ORIGIN_ORG_KEY]);
    command.push(answers[InteractiveQuestion.DESTINATION_ORG_KEY]);

    // Global options
    command = command
      // TODO: What if the command is generated dynamically?
      .concat(this.saveOptionIfExists(answers, '--', InteractiveQuestion.CONTENT_TO_DIFF))
      .concat(this.saveOptionIfExists(answers, '--', InteractiveQuestion.CONTENT_TO_GRADUATE))
      .concat(this.saveOptionIfExists(answers, '-F ', InteractiveQuestion.FORCE_GRADUATION))
      .concat(this.saveOptionIfExists(answers, '-m ', InteractiveQuestion.GRADUATE_OPERATIONS))
      .concat(this.saveOptionIfExists(answers, '-O ', InteractiveQuestion.LOG_FILENAME))
      .concat(this.saveOptionIfExists(answers, '-l ', InteractiveQuestion.LOG_LEVEL))
      .concat(this.saveOptionIfExists(answers, '-i ', InteractiveQuestion.KEY_TO_IGNORE))
      .concat(this.saveOptionIfExists(answers, '-o ', InteractiveQuestion.KEY_TO_INCLUDE_ONLY));

    return command.join(' ');
  }

  private getApplicationFilename(): string {
    return process.argv[1];
  }

  private setShebangLine(): string {
    return '#!/bin/sh\n';
  }

  private saveOptionIfExists(answers: Answers, prefix: string, option: string): string[] {
    const answer = answers[option];

    if (typeof answer === 'object' && Utils.isEmptyArray(answer)) {
      return [];
    }

    return answer && Utils.isNonEmptyString(answer) ? [`${prefix}${answer}`] : [];
  }
}
