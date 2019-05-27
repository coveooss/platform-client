import * as _ from 'underscore';
import { IPipeline } from '../commons/interfaces/IPipeline';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { JsonUtils } from '../commons/utils/JsonUtils';
import { BaseCoveoObject } from './BaseCoveoObject';

export class Pipeline extends BaseCoveoObject implements IPipeline {
  constructor(private fieldModel: IStringMap<any>) {
    super(fieldModel['id']);
  }

  /**
   * Returns the name of the pipeline.
   *
   * @returns {string} Pipeline Name
   */
  getName(): string {
    return this.fieldModel['name'];
  }

  removeParameters(parameterKeys: string[]) {
    this.fieldModel = _.omit(this.fieldModel, parameterKeys);
  }

  /**
   * Returns the field model containing all the field's properties.
   *
   * @returns {IStringMap<any>} field Model
   */
  getFieldModel(): IStringMap<any> {
    return this.fieldModel;
  }

  clone(): Pipeline {
    return new Pipeline(JsonUtils.clone(this.getFieldModel()));
  }

  addToFieldModel(statements: IStringMap<any>) {
    this.fieldModel = _.extend(this.fieldModel, statements);
  }
}
