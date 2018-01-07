export class DiffResultArray<T> {
  public NEW: T[];
  public UPDATED: T[];
  public DELETED: T[];

  constructor() {
    this.NEW = [];
    this.UPDATED = [];
    this.DELETED = [];
  }

  public getCount(): number {
    return this.NEW.length + this.UPDATED.length + this.DELETED.length;
  }

  public containsItems(): boolean {
    return this.NEW.length + this.UPDATED.length + this.DELETED.length > 0;
  }
}
