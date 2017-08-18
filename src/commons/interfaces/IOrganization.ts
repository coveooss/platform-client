// External packages

// Internal packages
import { ICoveoObject } from './ICoveoObject';
import { ISource } from './ISource';
import { Dictionary } from '../collections/Dictionary';

export interface IOrganization extends ICoveoObject {
	ApiKey: string;
	Sources: Dictionary<ISource>;
	Extensions: Dictionary<ICoveoObject>;
	Clone(): IOrganization;
};
