// External packages

// Internal packages
import {ICoveoObject} from '../commons/interfaces/ICoveoObject';

export class BaseModel implements ICoveoObject {
    private id: string = '';
    private configuration: any = '';

    get Id(): string {
        return this.id;
    }
    set Id(id: string) {
        this.id = id;
    }

    get Configuration(): any {
        return this.configuration;
    }
    set Configuration(configuration: any) {
        this.configuration = configuration;
    }

    constructor(id: string) {
        this.id = id;
    }
}
