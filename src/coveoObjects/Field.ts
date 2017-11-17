import { IStringMap } from '../commons/interfaces/IStringMap';
import { BaseCoveoObject } from './BaseCoveoObject';
import { IField } from '../commons/interfaces/IField';

// TODO: Add a test class
export class Field extends BaseCoveoObject implements IField {

  constructor(name: string, private fieldModel: IStringMap<string>) {
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
   * @returns {IStringMap<string>} field Model
   */
  public getFieldModel(): IStringMap<string> {
    return this.fieldModel;
  }
}
