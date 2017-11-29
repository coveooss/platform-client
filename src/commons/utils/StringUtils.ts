import { Assert } from '../misc/Assert';

export class StringUtils {
  static replaceAll(initialString: string, searchString: string, replaceString: string): string {
    Assert.isNotUndefined(initialString, 'Cannot replace InitialString if empty');
    return initialString.replace(new RegExp(searchString, 'g'), replaceString);
  }

  static parseList(val: string, delimiter: string = ','): string[] {
    return val.split(delimiter);
  }
}
