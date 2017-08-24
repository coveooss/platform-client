// External packages

// Internal packages
import { ICoveoObject } from './ICoveoObject';
import { ISource } from './ISource';
import { Dictionary } from '../collections/Dictionary';

export interface IOrganization extends ICoveoObject {
	ApiKey: string;
	Fields: Dictionary<ICoveoObject>;
	Sources: Dictionary<ISource>;
	Extensions: Dictionary<ICoveoObject>;
	QueryPipelines: Dictionary<ICoveoObject>;
	Authentications: Dictionary<ICoveoObject>;
	HostedSearchPages: Dictionary<ICoveoObject>;
	SecurityProviders: Dictionary<ICoveoObject>;
	CustomDimensions: Dictionary<ICoveoObject>;
	NamedFilters: Dictionary<ICoveoObject>;
	Reports: Dictionary<ICoveoObject>;
	Clone(): IOrganization;
};
