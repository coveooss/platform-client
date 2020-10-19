import {
  appendFile as fs_appendFile,
  writeJson as fs_writeJson,
  readJson as fs_readJson,
  appendFileSync as fs_appendFileSync,
} from 'fs-extra';

export class FileUtils {
  static appendToFile(outputFile: string, data: any): Promise<void> {
    return fs_appendFile(outputFile, data);
  }

  static appendFileSync(outputFile: string, data: any): void {
    fs_appendFileSync(outputFile, data);
  }

  static writeJson(outputFile: string, data: any, space: number = 2): Promise<void> {
    return fs_writeJson(outputFile, data, { spaces: space });
  }

  static readJson(inputFile: string): Promise<any> {
    return fs_readJson(inputFile);
  }
}
