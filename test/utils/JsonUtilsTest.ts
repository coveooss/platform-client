import { expect, should } from 'chai';
import { DiffUtils, IDiffOptions } from '../../src/commons/utils/DiffUtils';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { DiffResultArray } from '../../src/models/DiffResultArray';
import { IStringMap } from '../../src/commons/interfaces/IStringMap';
import { JsonUtils } from '../../src/commons/utils/JsonUtils';

export const JsonUtilsTest = () => {
  describe('Json Utils', () => {

    let simpleArray = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    let simpleObject = { one: 1, two: 2, three: 3 };

    let mixedJson = { id: 0, value: { permission: 0, identityType: [1, 2, 3] } };

    describe('HasKey Method', () => {
      it('It does not alter the initial array', () => {
        let arr = ['test', 2, true];
        JsonUtils.hasKey(arr, ['ipsum']);
        expect(arr).to.eql(['test', 2, true]);
      });

      it('It does not alter the initial object', () => {
        let obj = { a: 0, b: { c: 0, d: [1, 2, 3] } };
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
        let fields: string[] = ['not in json', 'keyboard cat'];

        expect(JsonUtils.hasKey(mixedJson, [])).to.be.false;
        expect(JsonUtils.hasKey([], fields)).to.be.false;
        expect(JsonUtils.hasKey([], [])).to.be.false;
      });

      it('Should return false if fields is NOT mixed JSON', () => {
        let fields: string[] = ['not in json', 'keyboard cat'];

        expect(JsonUtils.hasKey(mixedJson, fields)).to.be.false;
      });
    });

    describe('RemoveFieldFromJson', () => {
      it('It should not alter the initial object', () => {
        let obj = { one: 1, two: 2, three: 3 };
        JsonUtils.removeFieldsFromJson(obj, ['two']);
        expect(obj).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should NOT remove specified fields from JSON object if not found', () => {
        let obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeFieldsFromJson(simpleObject, ['four'])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should remove specified fields from JSON object', () => {
        let obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeFieldsFromJson(simpleObject, ['two'])).to.eql({ one: 1, three: 3 });
      });

      it('Should remove specified fields from JSON object', () => {
        let obj = {
          id: 0,
          value: {
            permission: 0,
            identityType: [1, 2, 3]
          }
        };
        expect(JsonUtils.removeFieldsFromJson(obj, ['identityType'])).to.eql({
          id: 0,
          value: {
            permission: 0
          }
        });
        expect(JsonUtils.removeFieldsFromJson(obj, ['id'])).to.eql({
          value: {
            permission: 0,
            identityType: [1, 2, 3]
          }
        });
        expect(JsonUtils.removeFieldsFromJson(obj, ['value'])).to.eql({
          id: 0
        });
      });
    });
  });
};
