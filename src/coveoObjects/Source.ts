import * as _ from 'underscore';
import { ISource } from '../commons/interfaces/ISource';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Assert } from '../commons/misc/Assert';
import { StringUtil } from '../commons/utils/StringUtils';

export class Source extends BaseCoveoObject implements ISource {
  constructor(private configuration: any) {
    super(configuration['id']);
    Assert.isNotUndefined(this.configuration['name'], 'Missing name from source configuration.');
    Assert.isNotUndefined(this.configuration['mappings'], 'Missing mappings from source configuration.');
    Assert.isNotUndefined(this.configuration['sourceType'], 'Missing sourceType from source configuration.');
    Assert.isNotUndefined(this.configuration['preConversionExtensions'], 'Missing preConversionExtensions from source configuration.');
    Assert.isNotUndefined(this.configuration['postConversionExtensions'], 'Missing postConversionExtensions from source configuration.');
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

  getPostConversionExtensions(): Array<IStringMap<string>> {
    return this.configuration['postConversionExtensions'];
  }

  getPreConversionExtensions(): Array<IStringMap<string>> {
    return this.configuration['preConversionExtensions'];
  }

  sortMappingsAndStripIds() {
    // Sort mappings
    let cleanedMappings: Array<IStringMap<string>> = _.sortBy(this.getMappings(), (mapping: IStringMap<string>) =>
      _.compact([mapping.fieldName, mapping.type]).join('-')
    );

    // Remove id from mappings
    cleanedMappings = _.map(cleanedMappings, (mapping: IStringMap<string>) => _.omit(mapping, 'id'));
    this.configuration['mappings'] = cleanedMappings;
  }

  removeParameters(keysToRemove: string[] = [], exclusiveKeys: string[] = []): void {
    this.configuration = JsonUtils.removeKeyValuePairsFromJson(this.configuration, keysToRemove, exclusiveKeys);
  }

  removeExtension(extensionId: string, stage: 'pre' | 'post') {
    this.configuration[`${stage}ConversionExtensions`] = _.reject(
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
