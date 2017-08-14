// External packages

// Internal packages
import {IOrganization} from '../commons/interfaces/iorganization';
import {Extension} from './ExtensionModel';

export class Organization implements IOrganization {
    _id:string = '';
    _name:string = '';
    _apiKey:string = '';
    _configuration:string = '';
    _extensions:Array<Extension> = new Array<Extension>();

    get Id():string {
        return this._id;
    }

    get Name():string {
        return this._name;
    }

    get ApiKey():string {
        return this._apiKey;
    }

    get Configuration():string {
        return this._configuration;
    }

    get Extensions():Array<Extension> {
        return this._extensions;
    }

    constructor(id:string, apiKey:string) {
        this._id = id;
        this._apiKey = apiKey;
    }
}