import * as _ from 'underscore';
import * as fs from 'fs-extra';
import { Answers } from 'inquirer';
import { Colors } from '../commons/colors';
import { Logger } from '../commons/logger';
import { Utils } from '../commons/utils/Utils';
import { InteractiveQuestion } from './InteractiveQuestion';

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

  start() {
    this.questions
      .start()
      .then((answers: Answers) => {
        const commandFilename = answers[InteractiveQuestion.SETTING_FILENAME];
        const command = ['platformclient', this.generateCommand(answers)].join(' ');
        fs.writeFile(commandFilename, [this.setShebangLine(), command].join('\n'))
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

  generateCommand(answers: Answers) {
    let command: string[] = [];

    // Required parameters
    command.push(_.compact([answers[InteractiveQuestion.COMMAND], answers[InteractiveQuestion.OBJECT_TO_MANIPULATE]]).join('-'));
    command.push(answers[InteractiveQuestion.ORIGIN_ORG_ID]);
    command.push(answers[InteractiveQuestion.DESTINATION_ORG_ID]);
    command.push(answers[InteractiveQuestion.MASTER_API_KEY]);

    // Global options
    command = command
      .concat(this.saveOptionIfExists(answers, '-S ', InteractiveQuestion.SOURCES))
      .concat(this.saveOptionIfExists(answers, '-E ', InteractiveQuestion.IGNORE_EXTENSIONS))
      .concat(this.saveOptionIfExists(answers, '-m ', InteractiveQuestion.GRADUATE_OPERATIONS))
      .concat(this.saveOptionIfExists(answers, '-O ', InteractiveQuestion.LOG_FILENAME))
      .concat(this.saveOptionIfExists(answers, '-l ', InteractiveQuestion.LOG_LEVEL))
      .concat(this.saveOptionIfExists(answers, '-i ', InteractiveQuestion.KEY_TO_IGNORE))
      .concat(this.saveOptionIfExists(answers, '-o ', InteractiveQuestion.KEY_TO_INCLUDE_ONLY))
      .concat(this.saveOptionIfExists(answers, '-s ', InteractiveQuestion.SOURCES_TO_REBUILD))
      .concat(this.saveOptionIfExists(answers, '--env ', InteractiveQuestion.ENVIRONMENT));

    return _.compact(command).join(' ');
  }

  private setShebangLine(): string {
    return '#!/bin/sh\n';
  }

  private saveOptionIfExists(answers: Answers, prefix: string, option: string): string[] {
    const answer = answers[option];

    return Array.isArray(answer)
      ? Utils.isEmptyArray(answer)
        ? []
        : [`${prefix}${answer}`]
      : Utils.isEmptyString(answer)
      ? []
      : [`${prefix}${answer}`];
  }
}
