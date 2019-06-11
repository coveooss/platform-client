import { IClonable, IConfigurable } from '../collections/Dictionary';

export interface ICoveoObject<T> extends IClonable<T>, IConfigurable<T> {
  getId(): string;
}
