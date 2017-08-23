// External packages

// Internal packages
import { IOrganization } from '../commons/interfaces/IOrganization';
import { BaseModel } from './BaseModel';
import { Extension } from './ExtensionModel';
import { SecurityProvider } from './SecurityProviderModel';
import { QueryPipeline } from './QueryPipelineModel';
import { Source } from './SourceModel';
import { FieldResult } from './FieldResultModel';
import { Dictionary } from '../commons/collections/Dictionary';

export class Organization extends BaseModel implements IOrganization {
    private apiKey: string = '';
    private sources: Dictionary<Source> = new Dictionary<Source>();
    private extensions: Dictionary<Extension> = new Dictionary<Extension>();
    private securityProviders: Dictionary<SecurityProvider> = new Dictionary<SecurityProvider>();
    private queryPipelines: Dictionary<QueryPipeline> = new Dictionary<QueryPipeline>();
    private fields: FieldResult;

    get ApiKey(): string {
        return this.apiKey;
    }

    get Sources(): Dictionary<Source> {
        return this.sources;
    }

    set Sources(value: Dictionary<Source>) {
        this.sources = value;
    }

    get Extensions(): Dictionary<Extension> {
        return this.extensions;
    }

    set Extensions(value: Dictionary<Extension>) {
        this.extensions = value;
    }

    get SecurityProviders(): Dictionary<SecurityProvider> {
        return this.securityProviders;
    }

    set SecurityProviders(value: Dictionary<SecurityProvider>) {
        this.securityProviders = value;
    }

    get QueryPipelines(): Dictionary<SecurityProvider> {
        return this.queryPipelines;
    }

    set QueryPipelines(value: Dictionary<SecurityProvider>) {
        this.queryPipelines = value;
    }

    constructor(id: string, apiKey: string) {
        super(id);

        this.apiKey = apiKey;
    }

    public Clone(): IOrganization {
        let clone: IOrganization = new Organization(this.Id, this.ApiKey);

        clone.Name = this.Name;
        clone.Sources = this.sources.Clone();
        clone.Extensions = this.extensions.Clone();
        clone.SecurityProviders = this.securityProviders.Clone();
        clone.Configuration = this.Configuration;

        return clone;
    }
}
