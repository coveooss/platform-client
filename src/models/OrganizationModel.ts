// External packages

// Internal packages
import { IOrganization } from '../commons/interfaces/IOrganization';
import { BaseModel } from './BaseModel';
import { Extension } from './ExtensionModel';
import { SecurityProvider } from './SecurityProviderModel';
import { QueryPipeline } from './QueryPipelineModel';
import { Source } from './SourceModel';
import { HostedSearchPage } from './HostedSearchPageModel';
import { CustomDimension } from './CustomDimensionModel';
import { NamedFilter } from './NamedFilterModel';
import { Report } from './ReportModel';
import { SearchApiAuthentication } from './SearchApiAuthenticationModel';
import { Field } from './FieldModel';
import { Dictionary } from '../commons/collections/Dictionary';

// TODO: Add a test class
export class Organization extends BaseModel implements IOrganization {
    private apiKey: string = '';
    private fields: Dictionary<Field> = new Dictionary<Field>();
    private sources: Dictionary<Source> = new Dictionary<Source>();
    private extensions: Dictionary<Extension> = new Dictionary<Extension>();
    private securityProviders: Dictionary<SecurityProvider> = new Dictionary<SecurityProvider>();
    private authentications: Dictionary<SearchApiAuthentication> = new Dictionary<SearchApiAuthentication>();
    private queryPipelines: Dictionary<QueryPipeline> = new Dictionary<QueryPipeline>();
    private hostedSearchPages: Dictionary<HostedSearchPage> = new Dictionary<HostedSearchPage>();
    private customDimensions: Dictionary<CustomDimension> = new Dictionary<CustomDimension>();
    private namedFilters: Dictionary<NamedFilter> = new Dictionary<NamedFilter>();
    private reports: Dictionary<Report> = new Dictionary<Report>();

    get ApiKey(): string {
        return this.apiKey;
    }

    get Fields(): Dictionary<Field> {
        return this.fields;
    }

    set Fields(value: Dictionary<Field>) {
        this.fields = value;
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

    get QueryPipelines(): Dictionary<QueryPipeline> {
        return this.queryPipelines;
    }

    set QueryPipelines(value: Dictionary<QueryPipeline>) {
        this.queryPipelines = value;
    }

    get Authentications(): Dictionary<SearchApiAuthentication> {
        return this.authentications;
    }

    set Authentications(value: Dictionary<SearchApiAuthentication>) {
        this.authentications = value;
    }

    get HostedSearchPages(): Dictionary<HostedSearchPage> {
        return this.hostedSearchPages;
    }

    set HostedSearchPages(value: Dictionary<HostedSearchPage>) {
        this.hostedSearchPages = value;
    }

    get CustomDimensions(): Dictionary<CustomDimension> {
        return this.customDimensions;
    }

    set CustomDimensions(value: Dictionary<CustomDimension>) {
        this.customDimensions = value;
    }

    get NamedFilters(): Dictionary<NamedFilter> {
        return this.namedFilters;
    }

    set NamedFilters(value: Dictionary<NamedFilter>) {
        this.namedFilters = value;
    }

    get Reports(): Dictionary<Report> {
        return this.reports;
    }

    set Reports(value: Dictionary<Report>) {
        this.reports = value;
    }

    constructor(id: string, apiKey: string) {
        super(id);

        this.apiKey = apiKey;
    }
}
