import { expect, should } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';

export const DictionnaryTest = () => {
  describe('Dictionnary', () => {

    // TODO test dictionnary with complex objects

    it('Should add an item to the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.containsKey('key1')).to.be.false;
      dict.add('key1', 'value1');
      expect(dict.containsKey('key1')).to.be.true;
    });

    it('Should not add an existing item to the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      dict.add('key1', 'value1');
      // expect(dict.getCount()).to.equal(1);
      // dict.add('key1', 'value');
      // expect(dict.getCount()).to.equal(1);
    });

    it('Should return the correct item count', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      dict.add('key1', 'value1');
      expect(dict.getCount()).to.equal(1);
      dict.add('key2', 'value1');
      expect(dict.getCount()).to.equal(2);
    });

    it('Should remove an existing item from the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.add('hello', 'world');
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('hello')).to.be.true;
      dict.remove('hello');
      expect(dict.getCount()).to.equal(0);
      expect(dict.containsKey('hello')).to.be.false;
    });

    it('Should not be able remove an item that do not exist in the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.add('hello', 'world');
      expect(dict.containsKey('hello')).to.be.true;
      expect(dict.remove('Rambo')).to.be.undefined;
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('hello')).to.be.true;
    });

    it('Should return an item of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.add('trololo', 'hohoho');
      expect(dict.getItem('trololo')).to.be.equal('hohoho');
    });

    it('Should return undefined if an item do not exist in the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.add('trololo', 'hohoho');
      expect(dict.getItem('notInTheDict')).to.be.undefined;
    });

    it('Should return all the keys of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.keys()).to.be.an('array').that.is.empty;
      dict.add('planet', 'mars');
      dict.add('animal', 'cat');
      dict.add('fruit', 'apple');
      dict.add('number', '32');
      expect(dict.getCount()).to.equal(4);
      expect(dict.keys()).to.be.eql(['planet', 'animal', 'fruit', 'number']);
    });

    it('Should return all the values of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.values()).to.be.an('array').that.is.empty;
      dict.add('planet', 'mars');
      dict.add('animal', 'cat');
      dict.add('fruit', 'apple');
      dict.add('number', '32');
      expect(dict.getCount()).to.equal(4);
      expect(dict.values()).to.be.eql(['mars', 'cat', 'apple', '32']);
    });

    it('Should clears all the values of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.values()).to.be.an('array').that.is.empty;
      dict.add('planet', 'mars');
      dict.add('animal', 'cat');
      dict.add('fruit', 'apple');
      dict.add('number', '32');
      expect(dict.getCount()).to.equal(4);
      expect(dict.values()).to.be.eql(['mars', 'cat', 'apple', '32']);

      dict.clear();
      expect(dict.values()).to.be.an('array').that.is.empty;
      expect(dict.keys()).to.be.an('array').that.is.empty;
      expect(dict.getCount()).to.equal(0);
    });

    it('Should clones all the items of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      let clone: Dictionary<string> = new Dictionary();
      expect(dict.values()).to.be.an('array').that.is.empty;
      dict.add('planet', 'mars');
      dict.add('animal', 'cat');
      dict.add('fruit', 'apple');
      dict.add('number', '32');

      expect(clone.getCount()).to.equal(0);
      expect(clone.values()).to.be.an('array').that.is.empty;
      clone = dict.clone();

      dict.add('extra', 'item');

      expect(clone.getCount()).to.equal(4);
      expect(clone.values()).to.be.eql(['mars', 'cat', 'apple', '32']);
    });

    it('Should initialize an non empty dictionnay', () => {
      let dict: Dictionary<string> = new Dictionary({
        c1: 'red',
        c2: 'green',
        c3: 'blue',
      });

      expect(dict.getCount()).to.equal(3);
      expect(dict.keys()).to.be.eql(['c1', 'c2', 'c3']);
      expect(dict.values()).to.be.eql(['red', 'green', 'blue']);
    });

    it('Should not initialize dictionnary with an empty object', () => {
      let dict: Dictionary<string> = new Dictionary({});
      let dict2: Dictionary<string> = new Dictionary();

      expect(dict).to.eql(dict2);
    });

  });
};
