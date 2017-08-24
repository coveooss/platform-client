// External packages

// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { BaseModel } from './BaseModel';

export class Field extends BaseModel implements ICoveoObject {
    constructor(name: string, configuration: any) {
        super(name);
        this.Configuration = configuration;
        this.Name = name;
    }
}
