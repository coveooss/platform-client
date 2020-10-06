// tslint:disable:no-magic-numbers
import { isArray } from 'underscore';
import { expect } from 'chai';
import { Assert } from '../../../src/commons/misc/Assert';

export const AssertTest = () => {
  describe('Assert', () => {
    it('Should throw an error if the assert condition is not met', () => {
      // Just testing a couple of use cases... to increase the coverage :)

      expect(() => Assert.isString({})).to.throw();

      expect(() => Assert.isUndefined('not Undefined')).to.throw('Value should be undefined.');
      expect(() => Assert.isUndefined({})).to.throw('Value should be undefined.');
      expect(() => Assert.isUndefined(1)).to.throw('Value should be undefined.');

      expect(() => Assert.isNotUndefined(undefined)).to.throw('Value should not be undefined.');

      expect(() => Assert.isNull(undefined)).to.throw('Value should be null.');
      expect(() => Assert.isNotNull(null)).to.throw('Value should not be null.');

      expect(() => Assert.exists(null)).to.throw('Value should not be null or undefined');
      expect(() => Assert.exists(undefined)).to.throw('Value should not be null or undefined');

      expect(() => Assert.doesNotExists(1)).to.throw('Value should be null or undefined');
      expect(() => Assert.doesNotExists([])).to.throw('Value should be null or undefined');
      expect(() => Assert.doesNotExists({})).to.throw('Value should be null or undefined');
      expect(() => Assert.doesNotExists('')).to.throw('Value should be null or undefined');

      expect(() => Assert.isString(NaN)).to.throw('Value should be a string.');
      expect(() => Assert.isNumber('')).to.throw('Value should be a number.');

      expect(() => Assert.check(isArray({}))).to.throw();
    });
  });
};
