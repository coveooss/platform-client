import * as chalk from 'chalk';
import * as _ from 'underscore';
import { Utils } from './utils/Utils';
import { Assert } from './misc/Assert';
import { FileUtils } from './utils/FileUtils';

export class Logger {

  static VERBOSE: number = 1;
  static INFO: number = 2;
  static ERROR: number = 3;
  static NOTHING: number = 4;

  static level: number = Logger.INFO;
  static filename: string = 'coveo-cli.log';

  public static newAction(actionName: string) {
    let actionTime = new Date();
    let data = `\n\n#######################################\n${actionName}\n${actionTime}\n#######################################\n`;
    FileUtils.appendToFile(Logger.filename, data)
      .then(() => {
      })
      .catch((err: any) => {
        console.error('Unable to save log.');
      });
  }

  public static info(message: string, ...meta: any[]) {
    if (Logger.level <= Logger.INFO) {
      this.log('INFO', 'green', message, meta);
    }
    Logger.addToLogFile('INFO', message, meta);
  }

  public static error(message: string, ...meta: any[]) {
    if (Logger.level <= Logger.ERROR) {
      this.log('ERROR', 'red', message, meta);
    }
    Logger.addToLogFile('ERROR', message, meta);
  }

  public static verbose(message: string, ...meta: any[]) {
    if (Logger.level <= Logger.VERBOSE) {
      this.log('VERBOSE', 'yellow', message, meta);
    }
    Logger.addToLogFile('VERBOSE', message, meta);
  }

  public static addToLogFile(level: string, message: string, ...meta: any[]) {
    let today = (new Date()).toLocaleString();
    FileUtils.appendToFile(Logger.filename, [today, level, message, '\n'].join(' | '));
    _.each(meta, (m: any) => {
      if (!Utils.isEmptyString(m.toString())) {
        FileUtils.appendToFile(Logger.filename, [today, level, m.toString(), '\n'].join(' | '));
      }
    });
  }

  public static log(level: string, color: 'green' | 'yellow' | 'red', message: string, ...meta: any[]) {
    console.log(level + ': ' + chalk[color].bold(message));
    _.each(meta, (m: any) => {
      if (!Utils.isEmptyString(m.toString())) {
        console.log(level + ': ' + chalk[color](m.toString()));
      }
    });
  }

  static setLogLevel(level: string) {
    switch (level.toLowerCase()) {
      case 'info':
        Logger.level = Logger.INFO;
        break;
      case 'error':
        Logger.level = Logger.ERROR;
        break;
      case 'verbose':
        Logger.level = Logger.VERBOSE;
        break;
      case 'nothing':
        Logger.level = Logger.NOTHING;
        break;
      default:
        Logger.level = Logger.INFO;
        break;
    }
  }

  static setFilename(filename: string) {
    Assert.isNotUndefined(filename);
    Logger.filename = filename.toString();
  }

  static enable() {
    Logger.level = Logger.INFO;
  }

  static disable() {
    Logger.level = Logger.NOTHING;
  }
}
