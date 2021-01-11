import { IDiffOptions } from './IDiffOptions';

export interface IHTTPGraduateOptions {
  POST: boolean;
  PUT: boolean;
  DELETE: boolean;
}

export interface IGraduateOptions extends IHTTPGraduateOptions {
  rebuild?: boolean;
  diffOptions: IDiffOptions;
  /**
   * Specify which key to include before graduating the Object.
   * This option has precedence over keyblacklist option.
   * keyWhitelist is evaluated before the keyBlacklist
   */
  keyWhitelist?: string[];
  /**
   * Specify which key to strip before graduating the Object.
   */
  keyBlacklist?: string[];
  /**
   * If set to true, the graduation will fail if some source dependencies (fields, extensions) are missings
   */
  ensureFieldIntegrity?: boolean;
  /**
   * Specify if the rebuild should be silent. If set to true, no confirmation will be prompt to the user
   */
  silent?: boolean;
}
