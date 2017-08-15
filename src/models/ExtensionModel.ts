// External packages

// Internal packages
import {IExtension} from '../commons/interfaces/IExtension';
import {BaseModel} from './BaseModel';

export class Extension extends BaseModel implements IExtension {
    constructor(id:string) {
        super(id);
    }
}