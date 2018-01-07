import * as _ from 'underscore';
import { IDictionary } from '../interfaces/IDictionary';
import { IStringMap } from '../interfaces/IStringMap';
import { Assert } from '../misc/Assert';

export interface IClonable<T> {
  clone: () => T;
}

/**
 * Dictionary template class. This class is really
 */
export class Dictionary<T extends IClonable<T>> implements IDictionary<T> {
  private items: IStringMap<T> = {};
  private count: number = 0;

  constructor(obj?: IStringMap<T>) {
    if (obj) {
      _.each(obj, (v: T, k: string) => {
        this.add(k, v);
      });
    }
  }

  public containsKey(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  public getCount(): number {
    return this.count;
  }

  public add(key: string, value: T): void {
    if (!this.items.hasOwnProperty(key)) {
      this.count++;
    }

    this.items[key] = value;
  }

  public remove(key: string): T {
    if (this.containsKey(key)) {
      this.count--;
      delete this.items[key];
    }
    return this.items[key];
  }

  public getItem(key: string): T {
    return this.items[key];
  }

  public keys(): string[] {
    const keySet: string[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        keySet.push(prop);
      }
    }

    return keySet;
  }

  public values(): T[] {
    const values: T[] = [];

    for (const prop in this.items) {
      if (this.items.hasOwnProperty(prop)) {
        values.push(this.items[prop]);
      }
    }

    return values;
  }

  public clone(): Dictionary<T> {
    const original = this;
    const clone: Dictionary<T> = new Dictionary<T>();

    this.keys().forEach((key: string) => {
      Assert.check(
        typeof original.getItem(key).clone === 'function',
        'Unable to clone object. Make sure it implements the IClonable Interface'
      );
      // clone.add(key, JSON.parse(JSON.stringify(original.getItem(key))));
      clone.add(key, original.getItem(key).clone());
    });

    return clone;
  }

  public clear(): void {
    this.items = {};
    this.count = 0;
  }
}
