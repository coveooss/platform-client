export class DiffResultArray<T> {
  public TO_CREATE: T[];
  public TO_UPDATE: T[];
  public TO_DELETE: T[];

  constructor() {
    this.TO_CREATE = [];
    this.TO_UPDATE = [];
    this.TO_DELETE = [];
  }

  public getCount(): number {
    return this.TO_CREATE.length + this.TO_UPDATE.length + this.TO_DELETE.length;
  }

  public containsItems(): boolean {
    return this.TO_CREATE.length + this.TO_UPDATE.length + this.TO_DELETE.length > 0;
  }
}
