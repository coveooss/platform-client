export class StringUtil {
  static lowerAndStripSpaces(str: string): string {
    return str.toLowerCase().replace(/\s/g, '');
  }

  static matchesAny(testStr: string, regexList: string[]): boolean {
    // tslint:disable-next-line: forin
    for (const regex in regexList) {
      const regexResult = testStr.match(regex);
      if (regexResult && regexResult.length > 0) {
        return true;
      }
    }

    return false;
  }
}
