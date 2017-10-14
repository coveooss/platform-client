import { Dictionary } from '../commons/collections/Dictionary';
import { IDiffResult } from '../commons/interfaces/IDiffResult';

export class DiffResult<T> implements IDiffResult<T> {
  public NEW: Dictionary<T>;
  public UPDATED: Dictionary<T>;
  public DELETED: Dictionary<T>;

  constructor() {
    this.NEW = new Dictionary<T>();
    this.UPDATED = new Dictionary<T>();
    this.DELETED = new Dictionary<T>();
  }

  public ContainsItems(): boolean {
    return (this.NEW.Count() + this.UPDATED.Count() + this.DELETED.Count()) > 0;
  }
}
