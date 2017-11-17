export interface IDictionary<T> {
  add(key: string, value: T): void;
  containsKey(key: string): boolean;
  getCount(): number;
  getItem(key: string): T;
  keys(): string[];
  remove(key: string): T;
  values(): T[];
  clone(): IDictionary<T>;
  clear(): void;
}
