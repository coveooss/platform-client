import { expect, should } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';
import { ClonableTest } from './ClonableTest';

export const DictionnaryTest = () => {
  describe('Dictionnary', () => {

    // Constant variables
    const banana = {
      color: 'yellow',
      price: 3
    };
    const apple = {
      color: 'green',
      price: 2
    };
    const orange = {
      color: 'orange',
      price: 5
    };
    const strawberry = {
      color: 'red',
      price: 4
    };

    // TODO test dictionnary with complex objects
    it('Should add an item to the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.containsKey('banana')).to.be.false;
      let clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
    });

    it('Should not add an existing item to the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      let clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
      expect(dict.getCount()).to.equal(1);
      // It should not add this object since there is already an object with the same key in the dictionnary
      let clone2: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone2);
      expect(dict.getCount()).to.equal(1);
    });

    it('Should return the correct item count', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      // Adding a banana
      let clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
      expect(dict.getCount()).to.equal(1);
      // Now Adding an apple
      let clone2: ClonableTest = new ClonableTest('apple', banana);
      dict.add(clone2.getId(), clone2);
      // We now have 2 fruits in the basket :D
      expect(dict.getCount()).to.equal(2);
    });

    it('Should remove an existing item from the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: ClonableTest = new ClonableTest('banana', banana);
      // Adding a banana
      dict.add('banana', clone);
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('banana')).to.be.true;
      // Removing the banana
      dict.remove('banana');
      // No more fruit in the basket :(
      expect(dict.getCount()).to.equal(0);
      expect(dict.containsKey('banana')).to.be.false;
    });

    it('Should not be able remove an item that do not exist in the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: ClonableTest = new ClonableTest('banana', banana);
      // Adding a banana
      dict.add('banana', clone);
      expect(dict.containsKey('banana')).to.be.true;
      // Cannot remove a fruit that is not in the basket
      expect(dict.remove('tomato')).to.be.undefined;
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('banana')).to.be.true;
    });

    it('Should return an item of the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: ClonableTest = new ClonableTest('banana', banana);
      // Adding a banana
      dict.add('banana', clone);
      expect(dict.getItem('banana')).to.be.eql(clone);
      // Making sure we have a banana
      expect(dict.getItem('banana').getConfiguration()).to.be.eql(banana);
    });

    it('Should return undefined if an item do not exist in the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: ClonableTest = new ClonableTest('banana', banana);
      expect(dict.getItem('notInTheDict')).to.be.undefined;
    });

    it('Should return all the keys of the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      // Adding a bunch of fruits
      dict.add('banana', new ClonableTest('banana', banana));
      dict.add('apple', new ClonableTest('apple', apple));
      dict.add('orange', new ClonableTest('orange', orange));
      dict.add('strawberry', new ClonableTest('strawberry', strawberry));
      expect(dict.getCount()).to.equal(4);
      expect(dict.keys()).to.be.eql(['banana', 'apple', 'orange', 'strawberry']);
    });

    it('Should return all the values of the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();

      // Creating a bunch of fruit clones!
      const bananaClonable = new ClonableTest('banana', banana);
      const appleClonable = new ClonableTest('apple', apple);
      const orangeClonable = new ClonableTest('orange', orange);
      const strawberryClonable = new ClonableTest('strawberry', strawberry);

      // Adding a bunch of fruits
      dict.add('banana', bananaClonable);
      dict.add('apple', appleClonable);
      dict.add('orange', orangeClonable);
      dict.add('strawberry', strawberryClonable);

      expect(dict.getCount()).to.equal(4);
      expect(dict.values()).to.be.eql([bananaClonable, appleClonable, orangeClonable, strawberryClonable]);
    });

    it('Should clears all the values of the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      // Adding a bunch of fruits
      dict.add('banana', new ClonableTest('banana', banana));
      dict.add('apple', new ClonableTest('apple', apple));
      dict.add('orange', new ClonableTest('orange', orange));
      dict.add('strawberry', new ClonableTest('strawberry', strawberry));
      expect(dict.getCount()).to.equal(4);

      // No more fruits!
      dict.clear();
      expect(dict.values()).to.be.an('array').that.is.empty;
      expect(dict.keys()).to.be.an('array').that.is.empty;
      expect(dict.getCount()).to.equal(0);
    });

    it('Should clones all the items of the dictionnary', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: Dictionary<ClonableTest> = new Dictionary();

      // Adding a bunch of fruits
      dict.add('banana', new ClonableTest('banana', banana));
      dict.add('apple', new ClonableTest('apple', apple));
      dict.add('orange', new ClonableTest('orange', orange));

      expect(clone.getCount()).to.equal(0);
      expect(clone.values()).to.be.an('array').that.is.empty;

      // Cloning the dictionnary into the clone dictionnary :P
      clone = dict.clone();

      expect(clone.getCount()).to.equal(3);

      // Adding a fruit in the initial dictionnary should not affect the clone
      dict.add('strawberry', new ClonableTest('strawberry', strawberry));

      expect(clone.getCount()).to.equal(3);

      expect(clone.keys()).to.be.eql(['banana', 'apple', 'orange']);
    });

    it('Should initialize an non empty dictionnay', () => {
      const orangeClonable = new ClonableTest('orange', orange);
      const appleClonable = new ClonableTest('apple', apple);
      const bananaClonable = new ClonableTest('banana', banana);
      const strawberryClonable = new ClonableTest('strawberry', strawberry);

      let dict: Dictionary<ClonableTest> = new Dictionary({
        orange: orangeClonable,
        apple: appleClonable,
        banana: bananaClonable,
        strawberry: strawberryClonable
      });

      expect(dict.getCount()).to.equal(4);
      expect(dict.keys()).to.be.eql(['orange', 'apple', 'banana', 'strawberry']);
      expect(dict.values()).to.be.eql([orangeClonable, appleClonable, bananaClonable, strawberryClonable]);
    });

    it('Should not initialize dictionnary with an empty object', () => {
      let dict: Dictionary<ClonableTest> = new Dictionary({});
      let dict2: Dictionary<ClonableTest> = new Dictionary();

      expect(dict).to.eql(dict2);
    });

    it('Should not create a Dictionnary with an object that does not implement the clone method', () => {
      let dict: Dictionary<any> = new Dictionary();
      dict.add('asd', ['cvb', 234]);
      expect(dict.clone).to.throw();
    });

  });
};
