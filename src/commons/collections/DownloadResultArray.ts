import { BaseCoveoObject } from '../../coveoObjects/BaseCoveoObject';

export interface IDownloadResultArray {
  add(item: BaseCoveoObject): void;
  getCount(): number;
  containsItems(): boolean;
  /**
   * Sorts the items of this download. Sort is specific to Coveo object type.
   *
   * @memberof IDownloadResultArray
   */
  sort(): void;
  getItems(): BaseCoveoObject[];
}

export class DownloadResultArray implements IDownloadResultArray {
  private ITEMS: BaseCoveoObject[];

  constructor() {
    this.ITEMS = [];
  }

  add(item: BaseCoveoObject) {
    this.ITEMS.push(item);
  }

  getCount(): number {
    return this.ITEMS.length;
  }

  containsItems(): boolean {
    return this.ITEMS.length > 0;
  }

  sort(): void {
    this.ITEMS.sort((a: BaseCoveoObject, b: BaseCoveoObject) => {
      return a.getId().localeCompare(b.getId());
    });
  }

  getItems(): BaseCoveoObject[] {
    return this.ITEMS;
  }
}
