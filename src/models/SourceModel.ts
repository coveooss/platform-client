// External packages

// Internal packages
import { ISource } from '../commons/interfaces/ISource';
import { BaseModel } from './BaseModel';

export class Source extends BaseModel implements ISource {
    constructor(id:string) {
        super(id);
    }
}