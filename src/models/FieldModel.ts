// External packages

// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { BaseModel } from './BaseModel';

export class Field extends BaseModel implements ICoveoObject {
    constructor(name: string) {
        super(name);

        this.Name = name;
    }
}
