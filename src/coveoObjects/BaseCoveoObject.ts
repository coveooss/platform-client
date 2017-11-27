import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { Assert } from '../commons/misc/Assert';

/**
 * Every Coveo Object ultimately inherits from this base Model class.
 */
export class BaseCoveoObject implements ICoveoObject {
    protected id: string;

    constructor(id: string) {
        Assert.isNotUndefined(id);
        this.id = id;
    }

    /**
     * Return the IDof the Coveo Object. This is the most basic attribute of the objects
     *
     * @returns {string}
     */
    getId(): string {
        return this.id;
    }
}
