import { BaseCoveoObject } from '../../coveoObjects/BaseCoveoObject';

export class DownloadResultArray {
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

  /**
   * Sorts the items of this download. Sort is specific to Coveo object type.
   *
   * @memberof DownloadResultArray
   */
  sort(): void {
    this.ITEMS.sort((a: BaseCoveoObject, b: BaseCoveoObject) => {
      return a.getId().localeCompare(b.getId());
    });
  }

  getItems(): BaseCoveoObject[] {
    return this.ITEMS;
  }
}
