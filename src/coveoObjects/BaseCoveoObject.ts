import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Assert } from '../commons/misc/Assert';
import { StaticErrorMessage } from '../commons/errors';

/**
 * Every Coveo Object ultimately inherits from this base Model class.
 */
export abstract class BaseCoveoObject implements ICoveoObject {
  protected id: string;

  constructor(id: string) {
    Assert.isNotUndefined(id, StaticErrorMessage.INVALID_ID);
    this.id = id;
  }

  /**
   * Return the IDof the Coveo Object. This is the most basic attribute of the objects
   *
   * @returns {string}
   */
  public getId(): string {
    return this.id;
  }

  // public clone(): any {

  // }
}
