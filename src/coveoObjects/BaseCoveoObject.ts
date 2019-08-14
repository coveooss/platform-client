import { ICoveoObject } from '../commons/interfaces/ICoveoObject';

/**
 * Every Coveo Object ultimately inherits from this base Model class.
 */
export abstract class BaseCoveoObject implements ICoveoObject<BaseCoveoObject> {
  constructor(private id: string) {}

  /**
   * Return the IDof the Coveo Object. This is the most basic attribute of the objects
   *
   * @returns {string}
   */
  getId(): string {
    return this.id;
  }

  abstract clone(): BaseCoveoObject;
  abstract getConfiguration(): {};
}
