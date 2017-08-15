// External packages

// Internal packages
import { Dictionary } from '../collections/Dictionary';

export interface IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED: {
    old: Dictionary<T>,
    new: Dictionary<T>
  };
  DELETED: Dictionary<T>;
};
