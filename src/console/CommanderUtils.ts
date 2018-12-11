import { Logger } from '../commons/logger';

export class CommanderUtils {
  list(val: string) {
    return val.split(',');
  }

  setLogger(options: any, command: string) {
    Logger.setLogLevel(options.logLevel);
    Logger.setFilename(options.output);
    Logger.newAction(command);
  }
}
