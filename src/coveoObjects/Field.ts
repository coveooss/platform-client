import {} from 'underscore';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';
import { StringUtil } from '../commons/utils/StringUtils';
import { Assert } from '../commons/misc/Assert';
import { ICoveoObject } from '../commons/interfaces/ICoveoObject';

export interface IField extends ICoveoObject<Field> {}

export class Field extends BaseCoveoObject implements IField {
  constructor(private fieldModel: IStringMap<any>) {
    super(fieldModel['name']);
    Assert.exists(fieldModel['name'], 'Missing property "name" from fieldModel');
  }

  /**
   * Returns the name of the field. It is equivalent to it's ID.
   *
   * @returns {string} Field Name
   */
  getName(): string {
    return this.getId();
  }

  removeParameters(keysToRemove: string[] = [], exclusiveKeys: string[] = []): void {
    this.fieldModel = JsonUtils.removeKeyValuePairsFromJson(this.fieldModel, keysToRemove, exclusiveKeys);
  }

  isPartOfTheSources(sources: string[]): boolean {
    sources = sources.map((source) => StringUtil.lowerAndStripSpaces(source));

    for (let i = 0; i < (this.fieldModel.sources || []).length; i++) {
      const fieldSource: { name: string } = this.fieldModel.sources[i];
      if (fieldSource.name && sources.indexOf(StringUtil.lowerAndStripSpaces(fieldSource.name)) > -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns the field model containing all the field's properties.
   *
   * @returns {IStringMap<any>} field Model
   */
  getConfiguration(): IStringMap<any> {
    return this.fieldModel;
  }

  clone(): Field {
    return new Field(JsonUtils.clone(this.getConfiguration()));
  }
}
