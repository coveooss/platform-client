// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';

export const JsonUtilsTest = () => {
  describe('Json Utils', () => {
    const simpleArray = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    const simpleObject = { one: 1, two: 2, three: 3 };
    const mixedJson = {
      id: 0,
      value: {
        permission: 0,
        identityType: [1, 2, 3]
      }
    };

    describe('Stringify Method', () => {
      it('Should stringify object with indentation', () => {
        const content = JsonUtils.stringify(mixedJson);
        const stringified =
          '{\n\
  "id": 0,\n\
  "value": {\n\
    "permission": 0,\n\
    "identityType": [\n\
      1,\n\
      2,\n\
      3\n\
    ]\n\
  }\n\
}';

        expect(content).to.equal(stringified);
      });
    });

    describe('Flatten Method', () => {
      const arr1 = [[1, [2, 3]], [1, [2, 3]], 0];

      const obj1 = {
        a: 1,
        b: { c: 2, d: [3, 4] }
      };

      const obj2 = {
        a: 1,
        b: 2,
        c: 3
      };

      it('Should flatten an object', () => {
        expect(JsonUtils.flatten(obj1)).to.eql({ a: 1, 'b.c': 2, 'b.d.0': 3, 'b.d.1': 4 });
        expect(JsonUtils.flatten(obj2)).to.eql({ a: 1, b: 2, c: 3 });
        expect(JsonUtils.flatten(arr1)).to.eql({
          '0.0': 1,
          '0.1.0': 2,
          '0.1.1': 3,
          '1.0': 1,
          '1.1.0': 2,
          '1.1.1': 3,
          '2': 0
        });
      });
    });

    describe('Clone Method', () => {
      it('Should clone object', () => {
        const obj1 = {
          a: 1,
          b: { c: 2, d: [3, 4] }
        };
        // Creating clone object
        const clone = JsonUtils.clone(obj1);

        // Manipulating initial object
        obj1.b.c++;
        obj1.b.d = [1, 2, 3];
        expect(clone).to.eql({
          a: 1,
          b: { c: 2, d: [3, 4] }
        });
      });

      it('Should return null', () => {
        expect(JsonUtils.clone(undefined)).to.be.null;
        expect(JsonUtils.clone(null)).to.be.null;
        expect(JsonUtils.clone(String)).to.be.null;
        expect(JsonUtils.clone(() => void 0)).to.be.null;
      });
    });

    describe('HasKey Method', () => {
      it('It does not alter the initial array', () => {
        const arr = ['test', 2, true];
        JsonUtils.hasKey(arr, ['ipsum']);
        expect(arr).to.eql(['test', 2, true]);
      });

      it('It does not alter the initial object', () => {
        const obj = { a: 0, b: { c: 0, d: [1, 2, 3] } };
        JsonUtils.hasKey(obj, ['random']);
        expect(obj).to.eql({ a: 0, b: { c: 0, d: [1, 2, 3] } });
      });

      it('Test hasKey with a simple array', () => {
        // It always be false for arrays
        expect(JsonUtils.hasKey(simpleArray, ['ipsum'])).to.be.false;
        expect(JsonUtils.hasKey(simpleArray, ['ipsum', 'amet'])).to.be.false;
        expect(JsonUtils.hasKey(simpleArray, ['niah'])).to.be.false;
        expect(JsonUtils.hasKey(simpleArray, [])).to.be.false;
      });

      it('Test hasKey with a simple object', () => {
        expect(JsonUtils.hasKey(simpleObject, ['two'])).to.be.true;
        expect(JsonUtils.hasKey(simpleObject, ['two', 'three'])).to.be.true;
        expect(JsonUtils.hasKey(simpleObject, ['four'])).to.be.false;
        expect(JsonUtils.hasKey(simpleObject, [])).to.be.false;
      });

      it('Should return true if one the fields is in mixed JSON', () => {
        expect(JsonUtils.hasKey(mixedJson, ['identityType', 'not in json'])).to.be.true;
        expect(JsonUtils.hasKey(mixedJson, ['permission'])).to.be.true;
      });

      it('Should return false if passed an empty array', () => {
        const fields: string[] = ['not in json', 'keyboard cat'];

        expect(JsonUtils.hasKey(mixedJson, [])).to.be.false;
        expect(JsonUtils.hasKey([], fields)).to.be.false;
        expect(JsonUtils.hasKey([], [])).to.be.false;
      });

      it('Should return false if fields is NOT mixed JSON', () => {
        const fields: string[] = ['not in json', 'keyboard cat'];

        expect(JsonUtils.hasKey(mixedJson, fields)).to.be.false;
      });
    });

    describe('RemoveFieldFromJson - Whitelist Strategy', () => {
      it('It should not alter the initial object', () => {
        const obj = { one: 1, two: 2, three: 3 };
        JsonUtils.removeKeyValuePairsFromJson(obj, ['two'], ['one']);
        expect(obj).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should return an empty object if all the fields to include do not exsit', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['four', 'five'])).to.eql({});
      });

      it('Should only include the field that we specified', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['two'])).to.eql({ two: 2 });
      });

      it('Should include all the fields if all specified', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['one', 'two', 'three'])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should return the initial object', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], [])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should override blacklist strategy', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, ['one'], ['one', 'two'])).to.eql({ one: 1, two: 2 });
      });
    });

    describe('RemoveFieldFromJson - Blacklist Strategy', () => {
      it('It should not alter the initial object', () => {
        const obj = { one: 1, two: 2, three: 3 };
        JsonUtils.removeKeyValuePairsFromJson(obj, ['two']);
        expect(obj).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should NOT remove specified fields from JSON object if not found', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, ['four'])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should remove specified fields from JSON object', () => {
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, ['two'])).to.eql({ one: 1, three: 3 });
      });

      it('Should remove specified fields from JSON object', () => {
        const obj = {
          id: 0,
          value: {
            permission: 0,
            identityType: [1, 2, 3]
          }
        };
        expect(JsonUtils.removeKeyValuePairsFromJson(obj, ['identityType'])).to.eql({
          id: 0,
          value: {
            permission: 0
          }
        });
        expect(JsonUtils.removeKeyValuePairsFromJson(obj, ['id'])).to.eql({
          value: {
            permission: 0,
            identityType: [1, 2, 3]
          }
        });
        expect(JsonUtils.removeKeyValuePairsFromJson(obj, ['value'])).to.eql({
          id: 0
        });
      });
    });

    describe('sortObjectProperties Method,', () => {
      const inputObj = { one: 1, two: 2, three: { a: null, c: null, b: null } };
      const expectedOutputObj = { one: 1, three: { a: null, c: null, b: null }, two: 2 };
      const expectedOutputObjDeep = { one: 1, three: { a: null, b: null, c: null }, two: 2 };

      it('Should return a new object with its keys sorted', () => {
        const outputObj = JsonUtils.sortObjectProperties(inputObj);
        expect(outputObj).to.eql(expectedOutputObj);
      });
      it('Should not return the same object', () => {
        const outputObj = JsonUtils.sortObjectProperties(inputObj);
        expect(outputObj).to.not.equal(expectedOutputObj);
      });
      it('Should return a new object with its keys sorted, deep', () => {
        const outputObj = JsonUtils.sortObjectProperties(inputObj, true);
        expect(outputObj).to.eql(expectedOutputObjDeep);
      });
    });
  });
};
