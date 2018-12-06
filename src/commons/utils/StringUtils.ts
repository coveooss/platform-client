export class StringUtil {
  static lowerAndStripSpaces(str: string): string {
    return str.toLowerCase().replace(/\s/g, '');
  }
}
