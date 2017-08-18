// External packages

// Internal packages
import { ISource } from '../commons/interfaces/ISource';
import { BaseModel } from './BaseModel';

export class Source extends BaseModel implements ISource {
    private mappings: Array<any> = new Array<any>();
    private preConversionExtensions: Array<any> = new Array<any>();
    private postConversionExtensions: Array<any> = new Array<any>();
    private extendedDataFiles: any = '';

    get Mappings(): Array<any> {
        return this.mappings;
    }

    set Mappings(value: Array<any>) {
        this.mappings = value;
    }

    get PreConversionExtensions(): Array<any> {
        return this.preConversionExtensions;
    }

    set PreConversionExtensions(value: Array<any>) {
        this.preConversionExtensions = value;
    }

    get PostConversionExtensions(): Array<any> {
        return this.postConversionExtensions;
    }

    set PostConversionExtensions(value: Array<any>) {
        this.postConversionExtensions = value;
    }

    get ExtendedDataFiles(): any {
        return this.extendedDataFiles;
    }

    set ExtendedDataFiles(value: any) {
        this.extendedDataFiles = value;
    }

    constructor(id: string, configuration: any) {
        super(id);
        this.Configuration = configuration;
    }
}
