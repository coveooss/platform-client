// External packages

// Internal packages
import { Dictionary } from '../collections/Dictionary';

export interface IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED: Dictionary<T>;
  DELETED: Dictionary<T>;

  ContainsItems(): boolean;
};
