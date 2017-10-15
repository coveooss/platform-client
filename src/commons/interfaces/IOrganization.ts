import { ICoveoObject } from './ICoveoObject';
import { Dictionary } from '../collections/Dictionary';
import { Source } from '../../models/SourceModel';
import { BaseModel } from '../../models/BaseModel';
import { Field } from '../../models/FieldModel';

export interface IOrganization extends ICoveoObject {
	ApiKey: string;
	Fields: Dictionary<Field>;
	Sources: Dictionary<Source>;
	Extensions: Dictionary<BaseModel>;
	QueryPipelines: Dictionary<BaseModel>;
	Authentications: Dictionary<BaseModel>;
	HostedSearchPages: Dictionary<BaseModel>;
	SecurityProviders: Dictionary<BaseModel>;
	CustomDimensions: Dictionary<BaseModel>;
	NamedFilters: Dictionary<BaseModel>;
	Reports: Dictionary<BaseModel>;
};
