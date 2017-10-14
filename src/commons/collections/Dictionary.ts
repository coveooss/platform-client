// External packages

// Internal packages
import { IDictionary } from '../interfaces/IDictionary'
import { IStringMap } from '../interfaces/IStringMap';
import * as _ from 'underscore';

export class Dictionary<T> implements IDictionary<T> {
    private items: IStringMap<T> = {};
    private count: number = 0;

    constructor(obj?: IStringMap<T>) {
        if (obj) {
            _.each(obj, (v: T, k: string) => {
                this.Add(k, v);
            })
        }
    }

    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }

    public Count(): number {
        return this.count;
    }

    public Add(key: string, value: T): void {
        if (!this.items.hasOwnProperty(key)) {
            this.count++;
        }

        this.items[key] = value;
    }

    public Remove(key: string): T {
        if (this.ContainsKey(key)) {
            this.count--;
            delete this.items[key];
        }
        return this.items[key];
    }

    public Item(key: string): T {
        return this.items[key];
    }

    public Keys(): string[] {
        let keySet: Array<string> = [];

        for (let prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }

        return keySet;
    }

    public Values(): Array<T> {
        let values: Array<T> = [];

        for (let prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }

        return values;
    }

    public Clone(): Dictionary<T> {
        let clone: Dictionary<T> = new Dictionary<T>();
        let original = this;

        this.Keys().forEach(function (key: string) {
            clone.Add(key, original.Item(key));
        });

        return clone;
    }

    public Clear(): void {
        this.items = {};
        this.count = 0;
    }
}
