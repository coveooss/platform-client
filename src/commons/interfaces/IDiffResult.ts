import { Dictionary } from '../collections/Dictionary';

export interface IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED: Dictionary<T>;
  DELETED: Dictionary<T>;

  containsItems(): boolean;
}
