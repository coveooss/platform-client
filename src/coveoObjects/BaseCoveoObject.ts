import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Assert } from '../commons/misc/Assert';
import { StaticErrorMessage } from '../commons/errors';

/**
 * Every Coveo Object ultimately inherits from this base Model class.
 */
export abstract class BaseCoveoObject implements ICoveoObject {
  constructor(private id: string) {
    Assert.exists(id, StaticErrorMessage.INVALID_ID);
  }

  /**
   * Return the IDof the Coveo Object. This is the most basic attribute of the objects
   *
   * @returns {string}
   */
  public getId(): string {
    return this.id;
  }

  public abstract clone(): BaseCoveoObject;
}
