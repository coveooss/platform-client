// External packages

// Internal packages
import { Dictionary } from '../collections/Dictionary';

export interface IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED_OLD: Dictionary<T>;
  UPDATED_NEW: Dictionary<T>;
  DELETED: Dictionary<T>;
};
