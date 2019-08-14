import * as fs from 'fs-extra';

export class FileUtils {
  static appendToFile(outputFile: string, data: any): Promise<void> {
    return fs.appendFile(outputFile, data);
  }

  static writeJson(outputFile: string, data: any, space: number = 2): Promise<void> {
    return fs.writeJson(outputFile, data, { spaces: space });
  }

  static readJson(inputFile: string): Promise<any> {
    return fs.readJson(inputFile);
  }
}
