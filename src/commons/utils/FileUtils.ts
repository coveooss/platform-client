import * as fs from 'fs-extra';
// import { config } from './../../config/index';

export class FileUtils {
  static appendToFile(outputFile: string, data: any): Promise<void> {
    return fs.appendFile(outputFile, data);
  }

  static writeJson(outputFile: string, data: any): Promise<void> {
    return fs.writeJSON(outputFile, data, { spaces: 2 });
  }
}
