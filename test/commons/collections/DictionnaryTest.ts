import { expect, should } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';

export const DictionnaryTest = () => {
  describe('Dictionnary', () => {

    describe(`Create a new Dictionnary`, () => {
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
        expect(dict.Count()).to.equal(1);
        dict.Add('key1', 'value');
        expect(dict.Count()).to.equal(1);
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
        let deletedValue = dict.Remove('rambo');
        expect(deletedValue).to.be.undefined;
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
        expect(dict.Keys()).to.be.eql(['planet', 'animal', 'fruit', 'number']);
      });

      it('Should return all the values of the dictionnary', () => {
        let dict: Dictionary<string> = new Dictionary();
        expect(dict.Keys()).to.be.an('array').that.is.empty;
        dict.Add('planet', 'mars');
        dict.Add('animal', 'cat');
        dict.Add('fruit', 'apple');
        dict.Add('number', '32');
        expect(dict.Values()).to.be.eql(['mars', 'cat', 'apple', '32']);
      });

    });
  })
}
