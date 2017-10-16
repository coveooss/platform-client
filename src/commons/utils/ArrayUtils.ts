import { Assert } from '../misc/Assert';
export class ArrayUtils {

  /**
   * Returns an array with arrays of the given size.
   *
   * @param {T[]} array Array to split
   * @param {number} chunk_size Size of every group
   * @returns {T[][]} Array of chunks
   */
  static chunkArray<T>(array: T[], chunk_size: number): T[][] {
    Assert.isLargerThan(0, chunk_size);

    let results = [];

    while (array.length) {
      results.push(array.splice(0, chunk_size));
    }

    return results;
  }
}
