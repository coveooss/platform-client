export interface IFieldModel {
  dateFormat: string;
  description: string;
  facet: boolean;
  includeInQuery: boolean;
  includeInResults: boolean;
  mergeWithLexicon: boolean;
  multiValueFacet: boolean;
  multiValueFacetTokenizers: string;
  name: string;
  ranking: boolean;
  smartDateFacet: boolean;
  sort: boolean;
  stemming: boolean;
  system: boolean;
  type: number;
  useCacheForComputedFacet: boolean;
  useCacheForNestedQuery: boolean;
  useCacheForNumericQuery: boolean;
  useCacheForSort: boolean
}

export interface IFieldResult {
  items: IFieldModel[];
  totalPages: number;
  totalEntries: number;
}
