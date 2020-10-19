import { compact, map } from 'underscore';
import { Logger } from '../commons/logger';
import { showLoginPopup } from '../ui/login';

export class CommanderUtils {
  static list(val: string) {
    return map(compact(val.split(',')), (v) => v.trim());
  }

  static setLogger(options: any, command: string) {
    Logger.setLogLevel(options.logLevel);
    Logger.setFilename(options.output);
    Logger.newAction(command);
  }

  static async getAccessTokenFromLogingPopup(platformUrlOrigin: string): Promise<string> {
    Logger.startSpinner('Authenticating...');
    try {
      const accessToken = await showLoginPopup(platformUrlOrigin);
      Logger.stopSpinner();
      if (accessToken === null) {
        Logger.error('Unable to extract master token from session. Please use 2 dedicated API keys.');
        process.exit();
      } else {
        Logger.info('Authentication successful');
      }
      return accessToken;
    } catch (error) {
      Logger.stopSpinner();
      Logger.logOnly(error);
      Logger.error('Unable to authenticate using the web popup');
      process.exit();
    }
  }
}
