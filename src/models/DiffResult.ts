// External packages

// Internal packages
import { Dictionary } from '../commons/collections/Dictionary';
import { IDiffResult } from '../commons/interfaces/IDiffResult';

export class DiffResult<T> implements IDiffResult<T> {
  NEW: Dictionary<T>;
  UPDATED: {
    old: Dictionary<T>,
    new: Dictionary<T>
  };
  DELETED: Dictionary<T>;

  constructor() {
      this.NEW = new Dictionary<T>();
      this.UPDATED.old = new Dictionary<T>();
      this.UPDATED.new = new Dictionary<T>();
      this.DELETED = new Dictionary<T>();
  }
}