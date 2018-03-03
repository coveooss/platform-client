export class DiffResultArray<T> {
  TO_CREATE: T[];
  TO_UPDATE: T[];
  TO_DELETE: T[];

  constructor() {
    this.TO_CREATE = [];
    this.TO_UPDATE = [];
    this.TO_DELETE = [];
  }

  getCount(): number {
    return this.TO_CREATE.length + this.TO_UPDATE.length + this.TO_DELETE.length;
  }

  containsItems(): boolean {
    return this.TO_CREATE.length + this.TO_UPDATE.length + this.TO_DELETE.length > 0;
  }
}
