import { IOrganization } from '../commons/interfaces/IOrganization';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Extension } from './Extension';
import { Source } from './Source';
import { Field } from './Field';
import { Dictionary } from '../commons/collections/Dictionary';

// TODO: Add a test class
/**
 * Organization Class. By default, the organization instance do not contain any field, sources nor extension.
 * This is a way to prevent unecessary HTTP calls to the platform.
 * The Controllers are responsible to load those
 */
export class Organization extends BaseCoveoObject implements IOrganization {
    private fields: Dictionary<Field> = new Dictionary<Field>();
    private sources: Dictionary<Source> = new Dictionary<Source>();
    private extensions: Dictionary<Extension> = new Dictionary<Extension>();

    constructor(id: string, private apiKey: string) {
        super(id);
        this.apiKey = apiKey;
    }

    /**
     * Return the API key used for the manipulation on the Organization.
     *
     * @returns {string} API Key
     */
    public getApiKey(): string {
        return this.apiKey;
    }

    /**
     * Returns the all the fields available in the organization instance.
     *
     * @returns {Field[]} List of fields
     */
    public getFields(): Dictionary<Field> {
        return this.fields.clone();
    }

    public addField(fieldName: string, field: Field) {
        this.fields.add(fieldName, field);
    }

    public getSources(): Dictionary<Source> {
        return this.sources.clone();
    }

    public getExtensions(): Dictionary<Extension> {
        return this.extensions.clone();
    }

    public addExtensions(extensionName: string, extension: Extension) {
        this.extensions.add(extensionName, extension);
    }
}
