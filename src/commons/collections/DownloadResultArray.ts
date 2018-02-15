export class DownloadResultArray<T> {
  public ITEMS: T[];

  constructor() {
    this.ITEMS = [];
  }

  public getCount(): number {
    return this.ITEMS.length;
  }

  public containsItems(): boolean {
    return this.ITEMS.length > 0;
  }
}
