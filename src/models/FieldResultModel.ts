// External packages

// Internal packages
import {IField} from '../commons/interfaces/IField';
import {IFieldResult} from '../commons/interfaces/IFieldResult';
import {BaseModel} from './BaseModel';

export class FieldResult extends BaseModel implements IFieldResult {
    private items: Array<IField> = new Array<IField>();
    private totalPages: number;
    private totalEntries: number;

    get Items() {
        return this.items;
    }

    get TotalPages() {
        return this.totalPages;
    }

    get TotalEntries() {
        return this.totalEntries;
    }

    constructor(name:string) {
        super(name);

        this.Name = name;
    }
}