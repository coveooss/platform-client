// External packages

// Internal packages
import {IField} from '../commons/interfaces/IField';
import {BaseModel} from './BaseModel';

export class Field extends BaseModel implements IField {
    constructor(name:string) {
        super(name);

        this.Name = name;
    }
}