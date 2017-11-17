import { ICoveoObject } from '../commons/interfaces/ICoveoObject';
import { BaseCoveoObject } from './BaseCoveoObject';

export class Extension extends BaseCoveoObject implements ICoveoObject {
  constructor(id: string, configuration: any) {
    super(id);
  }
}
