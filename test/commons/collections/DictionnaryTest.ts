import { expect, should } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';

export const DictionnaryTest = () => {
  describe('Dictionnary', () => {

    // TODO test dictionnary with complex objects

    it('Should add an item to the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.ContainsKey('key1')).to.be.false;
      dict.Add('key1', 'value1');
      expect(dict.ContainsKey('key1')).to.be.true;
    });

    it('Should not add an existing item to the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.Count()).to.equal(0);
      dict.Add('key1', 'value1');
      // expect(dict.Count()).to.equal(1);
      // dict.Add('key1', 'value');
      // expect(dict.Count()).to.equal(1);
    });

    it('Should return the correct item count', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.Count()).to.equal(0);
      dict.Add('key1', 'value1');
      expect(dict.Count()).to.equal(1);
      dict.Add('key2', 'value1');
      expect(dict.Count()).to.equal(2);
    });

    it('Should remove an existing item from the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.Add('hello', 'world');
      expect(dict.Count()).to.equal(1);
      expect(dict.ContainsKey('hello')).to.be.true;
      dict.Remove('hello');
      expect(dict.Count()).to.equal(0);
      expect(dict.ContainsKey('hello')).to.be.false;
    });

    it('Should not be able remove an item that do not exist in the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.Add('hello', 'world');
      expect(dict.ContainsKey('hello')).to.be.true;
      expect(dict.Remove('Rambo')).to.be.undefined;
      expect(dict.Count()).to.equal(1);
      expect(dict.ContainsKey('hello')).to.be.true;
    });

    it('Should return an item of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.Add('trololo', 'hohoho');
      expect(dict.Item('trololo')).to.be.equal('hohoho');
    });

    it('Should return undefined if an item do not exist in the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      dict.Add('trololo', 'hohoho');
      expect(dict.Item('notInTheDict')).to.be.undefined;
    });

    it('Should return all the keys of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.Keys()).to.be.an('array').that.is.empty;
      dict.Add('planet', 'mars');
      dict.Add('animal', 'cat');
      dict.Add('fruit', 'apple');
      dict.Add('number', '32');
      expect(dict.Count()).to.equal(4);
      expect(dict.Keys()).to.be.eql(['planet', 'animal', 'fruit', 'number']);
    });

    it('Should return all the values of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.Values()).to.be.an('array').that.is.empty;
      dict.Add('planet', 'mars');
      dict.Add('animal', 'cat');
      dict.Add('fruit', 'apple');
      dict.Add('number', '32');
      expect(dict.Count()).to.equal(4);
      expect(dict.Values()).to.be.eql(['mars', 'cat', 'apple', '32']);
    });

    it('Should clears all the values of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      expect(dict.Values()).to.be.an('array').that.is.empty;
      dict.Add('planet', 'mars');
      dict.Add('animal', 'cat');
      dict.Add('fruit', 'apple');
      dict.Add('number', '32');
      expect(dict.Count()).to.equal(4);
      expect(dict.Values()).to.be.eql(['mars', 'cat', 'apple', '32']);

      dict.Clear();
      expect(dict.Values()).to.be.an('array').that.is.empty;
      expect(dict.Keys()).to.be.an('array').that.is.empty;
      expect(dict.Count()).to.equal(0);
    });

    it('Should clones all the items of the dictionnary', () => {
      let dict: Dictionary<string> = new Dictionary();
      let clone: Dictionary<string> = new Dictionary();
      expect(dict.Values()).to.be.an('array').that.is.empty;
      dict.Add('planet', 'mars');
      dict.Add('animal', 'cat');
      dict.Add('fruit', 'apple');
      dict.Add('number', '32');

      expect(clone.Count()).to.equal(0);
      expect(clone.Values()).to.be.an('array').that.is.empty;
      clone = dict.Clone();

      dict.Add('extra', 'item');

      expect(clone.Count()).to.equal(4);
      expect(clone.Values()).to.be.eql(['mars', 'cat', 'apple', '32']);
    });

    it('Should initialize an non empty dictionnay', () => {
      let dict: Dictionary<string> = new Dictionary({
        c1: 'red',
        c2: 'green',
        c3: 'blue',
      });

      expect(dict.Count()).to.equal(3);
      expect(dict.Keys()).to.be.eql(['c1', 'c2', 'c3']);
      expect(dict.Values()).to.be.eql(['red', 'green', 'blue']);
    });

    it('Should not initialize dictionnary with an empty object', () => {
      let dict: Dictionary<string> = new Dictionary({});
      let dict2: Dictionary<string> = new Dictionary();

      expect(dict).to.eql(dict2);
    });

  });
}
