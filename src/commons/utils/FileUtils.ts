import * as fs from 'fs-extra';
import { config } from './../../config/index';

export class FileUtils {
  static writeFile(outputFile: string, data: any, errCallback: (err: NodeJS.ErrnoException) => void): void {
    fs.ensureDir(`${config.workingDirectory}output`)
      .then(() => {
        fs.writeFile(outputFile, data, errCallback);
      });
  }

  static appendToFile(outputFile: string, data: any): Promise<void> {
    return fs.appendFile(outputFile, data);
  }

  static writeJson(outputFile: string, data: any): Promise<void> {
    return fs.writeJSON(outputFile, data, { spaces: 2 });
  }
}
