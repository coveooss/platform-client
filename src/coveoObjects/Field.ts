import { IStringMap } from '../commons/interfaces/IStringMap';
import { BaseCoveoObject } from './BaseCoveoObject';
import { IField } from '../commons/interfaces/IField';
import { JsonUtils } from '../commons/utils/JsonUtils';

export class Field extends BaseCoveoObject implements IField {
  constructor(name: string, private fieldModel: IStringMap<any>) {
    super(name);
  }

  /**
   * Returns the name of the field. It is equivalent to it's ID.
   *
   * @returns {string} Field Name
   */
  public getName(): string {
    return this.getId();
  }

  /**
   * Returns the field model containing all the field's properties.
   *
   * @returns {IStringMap<any>} field Model
   */
  public getFieldModel(): IStringMap<any> {
    return this.fieldModel;
  }

  public clone(): Field {
    return new Field(this.getName(), JsonUtils.clone(this.getFieldModel()));
  }
}
