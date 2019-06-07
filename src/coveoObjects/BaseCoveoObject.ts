import { StaticErrorMessage } from '../commons/errors';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Assert } from '../commons/misc/Assert';

/**
 * Every Coveo Object ultimately inherits from this base Model class.
 */
export abstract class BaseCoveoObject implements ICoveoObject<BaseCoveoObject> {
  constructor(private id: string) {
    Assert.exists(id, StaticErrorMessage.INVALID_ID);
  }

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
