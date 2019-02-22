import * as _ from 'underscore';
import { Logger } from '../commons/logger';

export class CommanderUtils {
  list(val: string) {
    return _.map(_.compact(val.split(',')), v => v.trim());
  }

  setLogger(options: any, command: string) {
    Logger.setLogLevel(options.logLevel);
    Logger.setFilename(options.output);
    Logger.newAction(command);
  }
}
