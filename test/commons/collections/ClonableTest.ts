import { JsonUtils } from '../../../src/commons/utils/JsonUtils';

export class ClonableTest {
  constructor(private id: string, private configuation: any) { }
  getId(): string {
    return this.id;
  }
  getConfiguration(): any {
    return this.configuation;
  }
  clone(): ClonableTest {
    return new ClonableTest(this.id, JsonUtils.clone(this.configuation));
  }
}
