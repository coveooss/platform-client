// External packages

// Internal packages
import {IExtension} from '../commons/interfaces/iextension';
import {BaseModel} from './BaseModel';

export class Extension extends BaseModel implements IExtension {
    constructor() {
        super();
    }
}