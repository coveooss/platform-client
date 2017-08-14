// External packages

// Internal packages
import {IOrganization} from '../commons/interfaces/iorganization';
import {BaseModel} from './BaseModel';
import {Extension} from './ExtensionModel';

export class Organization extends BaseModel implements IOrganization {
    apiKey:string = '';
    extensions:Array<Extension> = new Array<Extension>();

    get ApiKey():string {
        return this.apiKey;
    }

    get Extensions():Array<Extension> {
        return this.extensions;
    }

    constructor(id:string, apiKey:string) {
        super();
        
        this.id = id;
        this.apiKey = apiKey;
    }
}