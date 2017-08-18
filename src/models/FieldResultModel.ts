// External packages

// Internal packages
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { IFieldResult } from '../commons/interfaces/IFieldResult';
import { BaseModel } from './BaseModel';

export class FieldResult extends BaseModel implements IFieldResult {
    private items: Array<ICoveoObject> = new Array<ICoveoObject>();
    private totalPages: number;
    private totalEntries: number;

    get Items(): Array<ICoveoObject> {
        return this.items;
    }

    get TotalPages(): number {
        return this.totalPages;
    }

    get TotalEntries(): number {
        return this.totalEntries;
    }

    constructor(name: string) {
        super(name);

        this.Name = name;
    }
}
