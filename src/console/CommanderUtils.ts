import { compact, map } from 'underscore';
import { Logger } from '../commons/logger';

export class CommanderUtils {
  static list(val: string) {
    return map(compact(val.split(',')), (v) => v.trim());
  }

  static setLogger(options: any, command: string) {
    Logger.setLogLevel(options.logLevel);
    Logger.setFilename(options.output);
    Logger.newAction(command);
  }
}
