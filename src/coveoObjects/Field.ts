import { IField } from '../commons/interfaces/IField';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';

export class Field extends BaseCoveoObject implements IField {
  constructor(private fieldModel: IStringMap<any>) {
    super(fieldModel['name']);
  }

  /**
   * Returns the name of the field. It is equivalent to it's ID.
   *
   * @returns {string} Field Name
   */
  getName(): string {
    return this.getId();
  }

  /**
   * Returns the field model containing all the field's properties.
   *
   * @returns {IStringMap<any>} field Model
   */
  getFieldModel(): IStringMap<any> {
    return this.fieldModel;
  }

  clone(): Field {
    return new Field(JsonUtils.clone(this.getFieldModel()));
  }
}
