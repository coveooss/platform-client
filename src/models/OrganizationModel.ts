// External packages

// Internal packages
import {IOrganization} from '../commons/interfaces/IOrganization';
import {BaseModel} from './BaseModel';
import {Extension} from './ExtensionModel';
import {FieldResult} from './FieldResultModel';

export class Organization extends BaseModel implements IOrganization {
    private apiKey:string = '';
    private extensions:Array<Extension> = new Array<Extension>();
    private fields:FieldResult;

    get ApiKey():string {
        return this.apiKey;
    }

    get Extensions():Array<Extension> {
        return this.extensions;
    }

    constructor(id:string, apiKey:string) {
        super(id);

        this.apiKey = apiKey;
    }
}