export class StringUtils {
  static replaceAll(initialString: string, searchString: string, replaceString: string): string {
    return initialString.replace(new RegExp(searchString, 'g'), replaceString);
  }
}
