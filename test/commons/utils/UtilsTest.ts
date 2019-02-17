import { expect } from 'chai';
import { Utils } from '../../../src/commons/utils/Utils';

export const UtilsTest = () => {
  describe('Utils', () => {
    it('Should be null', () => {
      expect(Utils.isNull(null)).to.be.true;
      expect(Utils.isNull(undefined)).to.be.false;
      expect(Utils.isNull([])).to.be.false;
      expect(Utils.isNull('')).to.be.false;
      expect(Utils.isNull(0)).to.be.false;
    });

    it('Should be undefined', () => {
      expect(Utils.isUndefined(undefined)).to.be.true;
      expect(Utils.isUndefined(null)).to.be.false;
      expect(Utils.isUndefined([])).to.be.false;
      expect(Utils.isUndefined('')).to.be.false;
      expect(Utils.isUndefined(0)).to.be.false;
    });

    it('Should be null or undefined', () => {
      expect(Utils.isNullOrUndefined(undefined)).to.be.true;
      expect(Utils.isNullOrUndefined(null)).to.be.true;
      expect(Utils.isNullOrUndefined([])).to.be.false;
      expect(Utils.isNullOrUndefined('')).to.be.false;
      expect(Utils.isNullOrUndefined(0)).to.be.false;
    });

    it('Should exists', () => {
      expect(Utils.exists(undefined)).to.be.false;
      expect(Utils.exists(null)).to.be.false;
      expect(Utils.exists([])).to.be.true;
      expect(Utils.exists('')).to.be.true;
      expect(Utils.exists(0)).to.be.true;
    });

    it('Should return a string', () => {
      // expect(Utils.toNotNullString(undefined)).to.be.eql('');
      // expect(Utils.toNotNullString(null)).to.be.eql('');
      expect(Utils.toNotNullString('test')).to.be.eql('test');
    });

    it('Should return a string from any type', () => {
      expect(Utils.anyTypeToString(undefined)).to.be.eql('');
      expect(Utils.anyTypeToString(null)).to.be.eql('');
      expect(Utils.anyTypeToString([])).to.be.eql('');
      expect(Utils.anyTypeToString(['a', 'b', 'c'])).to.be.eql('a,b,c');
      expect(Utils.anyTypeToString(1)).to.be.eql('1');
      expect(Utils.anyTypeToString('test')).to.be.eql('test');
    });

    it('Should return true if empty string', () => {
      // expect(Utils.isNullOrEmptyString(null)).to.be.true;
      expect(Utils.isNullOrEmptyString('')).to.be.true;
      // expect(Utils.isNullOrEmptyString(undefined)).to.be.true;
      expect(Utils.isNullOrEmptyString('not empty')).to.be.false;
    });

    it('Should return true if string starts with', () => {
      expect(Utils.stringStartsWith('this is a test', 'this')).to.be.true;
      expect(Utils.stringStartsWith('', '')).to.be.true;
      expect(Utils.stringStartsWith('yes', 'yes')).to.be.true;
      // expect(Utils.stringStartsWith(undefined, 'test')).to.be.false;
      // expect(Utils.stringStartsWith(null, 'test')).to.be.false;
      expect(Utils.stringStartsWith('somthing', 'else')).to.be.false;
    });

    it('Should return true if the array is not empty', () => {
      expect(Utils.isNonEmptyArray([])).to.be.false;
      expect(Utils.isNonEmptyArray([1])).to.be.true;
      expect(Utils.isNonEmptyArray([undefined])).to.be.true;
      expect(Utils.isNonEmptyArray([null])).to.be.true;
    });

    it('Should return true if the array is empty', () => {
      expect(Utils.isEmptyArray([])).to.be.true;
      expect(Utils.isEmptyArray([1])).to.be.false;
      expect(Utils.isEmptyArray([undefined])).to.be.false;
      expect(Utils.isEmptyArray([null])).to.be.false;
    });
  });
};
