import * as Ora from 'ora';
import * as _ from 'underscore';
import { Assert } from './misc/Assert';
import { FileUtils } from './utils/FileUtils';
import { Utils } from './utils/Utils';

declare const require: (module: string) => any;
const stripAnsi = require('strip-ansi');

/**
 * The LoggerSingleton which is a Singleton class.
 *
 * @export
 * @class LoggerSingleton
 */
/* istanbul ignore next */
export class LoggerSingleton {
  private static logger: LoggerSingleton = new LoggerSingleton();

  static INSANE: number = 1;
  static VERBOSE: number = 2;
  static INFO: number = 3;
  static ERROR: number = 4;
  static NOTHING: number = 5;

  static getInstance(): LoggerSingleton {
    return this.logger;
  }

  // tslint:disable-next-line:typedef
  private spinner = Ora();
  private level: number = LoggerSingleton.INFO;
  private filename: string = 'platform-client.log';
  private spinnerEnabled: boolean = true;

  private isSpinnerEnabled(): boolean {
    return this.spinnerEnabled;
  }

  newAction(actionName: string): Promise<void> {
    const actionTime = new Date();
    const data = `\n\n#######################################\n${actionName}\n${actionTime}\n#######################################\n`;
    return FileUtils.appendToFile(this.filename, data).catch((err: any) => {
      console.error('Unable to save log', err);
    });
  }

  startSpinner(initialMessage?: string) {
    if (this.isSpinnerEnabled()) {
      this.spinner.start(initialMessage || '');
    }
  }

  stopSpinner() {
    if (this.isSpinnerEnabled()) {
      this.spinner.stop();
    }
  }

  loadingTask(message: string) {
    if (this.isSpinnerEnabled()) {
      this.spinner.text = message;
    }
  }

  info(message: string, ...meta: any[]) {
    if (this.level <= LoggerSingleton.INFO) {
      this.log('INFO', 'succeed', message, meta);
    }
    this.addToLogFile('INFO', message, meta);
  }

  warn(message: string, ...meta: any[]) {
    if (this.level <= LoggerSingleton.INFO) {
      this.log('WARN', 'warn', message, meta);
    }
    this.addToLogFile('WARN', message, meta);
  }

  error(message: string, ...meta: any[]) {
    if (this.level <= LoggerSingleton.ERROR) {
      this.log('ERROR', 'fail', message, meta);
    }
    this.addToLogFile('ERROR', message, meta);
  }

  verbose(message: string, ...meta: any[]) {
    if (this.level <= LoggerSingleton.VERBOSE) {
      this.log('VERBOSE', 'info', message, meta);
    }
    this.addToLogFile('VERBOSE', message, meta);
  }

  insane(message: string, ...meta: any[]) {
    if (this.level <= LoggerSingleton.INSANE) {
      this.log('INSANE', 'succeed', message, meta);
    }
    this.addToLogFile('INSANE', message, meta);
  }

  addToLogFile(level: string, message: string, ...meta: any[]) {
    const today = new Date().toLocaleString();
    FileUtils.appendToFile(this.filename, [today, level, stripAnsi(message), '\n'].join(' | '));
    _.each(meta, (m: any) => {
      if (!Utils.isEmptyString(m.toString())) {
        FileUtils.appendToFile(this.filename, [today, level, stripAnsi(m).toString(), '\n'].join(' | '));
      }
    });
  }

  log(level: string, logAction: 'succeed' | 'warn' | 'fail' | 'info', message: string, ...meta: any[]) {
    let fullMessage: string = '';
    _.each(meta, (m: any) => {
      if (!Utils.isEmptyString(m.toString())) {
        fullMessage += `\n${m.toString()}`;
      }
    });

    if (this.isSpinnerEnabled()) {
      this.spinner[logAction](message + fullMessage);
      this.startSpinner();
    }
  }

  setLogLevel(level: string) {
    switch (level.toLowerCase()) {
      case 'info':
        this.level = LoggerSingleton.INFO;
        break;
      case 'error':
        this.level = LoggerSingleton.ERROR;
        break;
      case 'verbose':
        this.level = LoggerSingleton.VERBOSE;
        break;
      case 'insane':
        this.level = LoggerSingleton.INSANE;
        break;
      case 'nothing':
        this.level = LoggerSingleton.NOTHING;
        break;
      default:
        this.level = LoggerSingleton.INFO;
        break;
    }
  }

  setFilename(filename: string) {
    Assert.isNotUndefined(filename);
    this.filename = filename.toString();
  }

  getFilename(): string {
    return this.filename;
  }

  enable() {
    this.level = LoggerSingleton.INFO;
  }

  disable() {
    this.level = LoggerSingleton.NOTHING;
  }

  disableSpinner() {
    this.spinnerEnabled = false;
  }

  enableSpinner() {
    this.spinnerEnabled = true;
  }

  getLogLevel(): number {
    return this.level;
  }
}

export let Logger = LoggerSingleton.getInstance();
