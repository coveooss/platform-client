// External packages

// Internal packages
import {ICoveoObject} from '../commons/interfaces/icoveoobject';

export class Extension implements ICoveoObject {
    id:string;
    name:string;
    configuration:string;
}