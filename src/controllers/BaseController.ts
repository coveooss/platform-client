import { Logger } from '../commons/logger';
/**
 * Every controller in the cli ultimately inherits from this base controller class.
 */
export class BaseController {
  /**
   * Allows controller to log into the terminal.
   */
  public logger: Logger;

  constructor() {
    this.logger = new Logger();
  }
}
