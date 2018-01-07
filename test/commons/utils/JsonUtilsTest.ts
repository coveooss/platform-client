// tslint:disable:no-magic-numbers
import { IDiffOptions } from './../../../src/commands/DiffCommand';
import { expect } from 'chai';
import { DiffUtils } from '../../../src/commons/utils/DiffUtils';
import { Dictionary } from '../../../src/commons/collections/Dictionary';
import { DiffResultArray } from '../../../src/commons/collections/DiffResultArray';
import { IStringMap } from '../../../src/commons/interfaces/IStringMap';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';

export const JsonUtilsTest = () => {
  describe('Json Utils', () => {
    const simpleArray = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
    const simpleObject = { one: 1, two: 2, three: 3 };
    const mixedJson = { id: 0, value: { permission: 0, identityType: [1, 2, 3] } };

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
        const obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['four', 'five'])).to.eql({});
      });

      it('Should only include the field that we specified', () => {
        const obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['two'])).to.eql({ two: 2 });
      });

      it('Should include all the fields if all specified', () => {
        const obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], ['one', 'two', 'three'])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should return the initial object', () => {
        const obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, [], [])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should override blacklist strategy', () => {
        const obj = { one: 1, two: 2, three: 3 };
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
        const obj = { one: 1, two: 2, three: 3 };
        expect(JsonUtils.removeKeyValuePairsFromJson(simpleObject, ['four'])).to.eql({ one: 1, two: 2, three: 3 });
      });

      it('Should remove specified fields from JSON object', () => {
        const obj = { one: 1, two: 2, three: 3 };
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
  });
};
