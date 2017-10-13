// External packages

// Internal packages
import { ICoveoObject } from './ICoveoObject';
import { Dictionary } from '../collections/Dictionary';

export interface ISource extends ICoveoObject {
    Mappings: Array<any>;
    PreConversionExtensions: Array<any>;
    PostConversionExtensions: Array<any>;
    ExtendedDataFiles: any;
};
