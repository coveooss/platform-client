import { IStringMap } from '../commons/interfaces/IStringMap';
import { IField } from '../commons/interfaces/IField';
import { StaticErrorMessage } from '../commons/errors';

export class Field implements IField {
  public name: string;

  constructor(public fieldModel: IStringMap<string>) {
    if (fieldModel['name'] === undefined) {
      throw new Error(StaticErrorMessage.MISSING_FIELD_NAME);
    }

    this.name = fieldModel['name'];
  }
}
