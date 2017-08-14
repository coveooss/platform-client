export class ObjectUtils {
  static isUndefined(obj: any): boolean {
    return typeof obj === 'undefined';
  }

  static isNull(obj: any): boolean {
    return obj === null;
  }

  static isNullOrUndefined(obj: any): boolean {
    return ObjectUtils.isNull(obj) || ObjectUtils.isUndefined(obj);
  }

  static exists(obj: any): boolean {
    return !ObjectUtils.isNullOrUndefined(obj);
  }

  static anyTypeToString(value: any): string {
    return value ? value.toString() : '';
  }
}
