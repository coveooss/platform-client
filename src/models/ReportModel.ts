// External packages

// Internal packages
import {ICoveoObject} from '../commons/interfaces/ICoveoObject';
import {BaseModel} from './BaseModel';

export class Report extends BaseModel implements ICoveoObject {
    constructor(id: string, configuration: any) {
        super(id);
        this.Configuration = configuration;
    }
}