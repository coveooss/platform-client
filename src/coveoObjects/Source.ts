import { compact, each, omit, pluck, reject, sortBy } from 'underscore';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Assert } from '../commons/misc/Assert';
import { StringUtil } from '../commons/utils/StringUtils';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { StaticErrorMessage } from '../commons/errors';

export interface ISource extends ICoveoObject<Source> {
  getMappings(): Array<IStringMap<string>>;
  getPreConversionExtensions(): any[];
  getPostConversionExtensions(): any[];
}

export class Source extends BaseCoveoObject implements ISource {
  constructor(private configuration: any) {
    super(configuration['id']);
    // Assert.isNotUndefined(this.configuration['id'], StaticErrorMessage.MISSING_SOURCE_ID);
    Assert.isNotUndefined(this.configuration['name'], StaticErrorMessage.MISSING_SOURCE_NAME);
    Assert.isNotUndefined(this.configuration['mappings'], StaticErrorMessage.MISSING_SOURCE_MAPPINGS);
    Assert.isNotUndefined(this.configuration['sourceType'], StaticErrorMessage.MISSING_SOURCE_SOURCETYPE);
    Assert.isNotUndefined(this.configuration['preConversionExtensions'], StaticErrorMessage.MISSING_SOURCE_PRECONVERSIONEXTENSIONS);
    Assert.isNotUndefined(this.configuration['postConversionExtensions'], StaticErrorMessage.MISSING_SOURCE_POSTCONVERSIONEXTENSIONS);
  }

  // This will be useful specialy for Salesforce sources
  getName(): string {
    return this.configuration['name'];
  }

  getSourceType(): Array<IStringMap<string>> {
    return this.configuration['sourceType'];
  }

  getMappings(): Array<IStringMap<string>> {
    return this.configuration['mappings'];
  }

  getFieldsFromMappings(): string[] {
    return pluck(this.getMappings(), 'fieldName');
  }

  getPostConversionExtensions(): Array<IStringMap<string>> {
    return this.configuration['postConversionExtensions'];
  }

  getPreConversionExtensions(): Array<IStringMap<string>> {
    return this.configuration['preConversionExtensions'];
  }

  sourceContainsSecurityProvider(): boolean {
    const secProv = this.getConfiguration()?.configuration?.securityProviders;
    return secProv !== {} && secProv !== undefined; // undefined for unit tests
  }

  restoreMappingIds(mappingIds: string[] = []) {
    const sourceMappings = this.getMappings();
    Assert.check(
      mappingIds.length === sourceMappings.length,
      `The number of ids (${mappingIds.length}) should match the number of mappings in the source (${sourceMappings.length})`
    );
    each(sourceMappings, (mapping: IStringMap<string>, idx: number) => {
      mapping['id'] = mappingIds[idx];
    });
  }

  /**
   * Sort mapping rules and strip ids.
   *
   * @returns {string[]} the mapping id (in order)
   * @memberof Source
   */
  sortMappingsAndStripIds(): string[] {
    const mappingIds: string[] = [];
    // Sort mappings
    let cleanedMappings: Array<IStringMap<string>> = sortBy(this.getMappings(), (mapping: IStringMap<string>) =>
      compact([mapping.fieldName, mapping.type, mapping.id]).join('-')
    );

    // Remove id from mappings
    cleanedMappings = cleanedMappings.map((mapping: IStringMap<string>) => {
      mappingIds.push(mapping['id']);
      return omit(mapping, 'id');
    });

    this.configuration['mappings'] = cleanedMappings;
    return mappingIds;
  }

  removeParameters(keysToRemove: string[] = [], exclusiveKeys: string[] = []): void {
    this.configuration = JsonUtils.removeKeyValuePairsFromJson(this.configuration, keysToRemove, exclusiveKeys);
  }

  removeExtension(extensionId: string, stage: 'pre' | 'post') {
    this.configuration[`${stage}ConversionExtensions`] = reject(
      this.configuration[`${stage}ConversionExtensions`],
      (extension: IStringMap<string>) =>
        StringUtil.lowerAndStripSpaces(extension.extensionId) === StringUtil.lowerAndStripSpaces(extensionId)
    );
  }

  getConfiguration(): any {
    return this.configuration;
  }

  clone(): Source {
    return new Source(JsonUtils.clone(this.configuration));
  }
}
