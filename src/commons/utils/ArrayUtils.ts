import { Assert } from '../misc/Assert';
export class ArrayUtils {
  /**
   * Returns an array with arrays of the given size.
   *
   * @param {T[]} array Array to split
   * @param {number} chunkSize Size of every group
   * @returns {T[][]} Array of chunks
   */
  static chunkArray<T>(array: T[], chunkSize: number): T[][] {
    Assert.isLargerThan(0, chunkSize);

    const results = [];

    while (array.length) {
      results.push(array.splice(0, chunkSize));
    }

    return results;
  }
}
