import { appendFile, writeJson, readJson } from 'fs-extra';

export class FileUtils {
  static appendToFile(outputFile: string, data: any): Promise<void> {
    return appendFile(outputFile, data);
  }

  static writeJson(outputFile: string, data: any, space: number = 2): Promise<void> {
    return writeJson(outputFile, data, { spaces: space });
  }

  static readJson(inputFile: string): Promise<any> {
    return readJson(inputFile);
  }
}
