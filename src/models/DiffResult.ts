// External packages

// Internal packages
import { Dictionary } from '../commons/collections/Dictionary';
import { IDiffResult } from '../commons/interfaces/IDiffResult';

export class DiffResult<T> implements IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED_OLD: Dictionary<T>;
  UPDATED_NEW: Dictionary<T>;
  DELETED: Dictionary<T>;

  constructor() {
      this.NEW = new Dictionary<T>();
      this.UPDATED_OLD = new Dictionary<T>();
      this.UPDATED_NEW = new Dictionary<T>();
      this.DELETED = new Dictionary<T>();
  }
}