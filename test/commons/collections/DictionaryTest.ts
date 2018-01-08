// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';
import { JsonUtils } from '../../../src/commons/utils/JsonUtils';
import { ClonableTest } from './ClonableTest';

export const DictionaryTest = () => {
  describe('Dictionary', () => {
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
    const complex = {
      color: 'blue',
      price: 10,
      classification: {
        category: {
          'Dry Fruits': {
            'Dehiscent Fruits': ['Loculicidal capsule', 'Septicidal capsule', 'Silique', 'Silicle', 'Pyxis', 'Poricidal capsule'],
            'Indehiscent fruits': ['Achene', 'Nut', 'Samara', 'Grain', 'Schizocarp']
          },
          'Fleshy Fruits': ['Drupe', 'Berry']
        }
      }
    };

    it('Should add an item to the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.containsKey('banana')).to.be.false;
      const clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
    });

    it('Should not add an existing item to the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      const clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
      expect(dict.getCount()).to.equal(1);
      // It should not add this object since there is already an object with the same key in the dictionary
      const clone2: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone2);
      expect(dict.getCount()).to.equal(1);
    });

    it('Should return the correct item count', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      expect(dict.getCount()).to.equal(0);
      // Adding a banana
      const clone: ClonableTest = new ClonableTest('banana', banana);
      dict.add(clone.getId(), clone);
      expect(dict.containsKey('banana')).to.be.true;
      expect(dict.getCount()).to.equal(1);
      // Now Adding an apple
      const clone2: ClonableTest = new ClonableTest('apple', banana);
      dict.add(clone2.getId(), clone2);
      // We now have 2 fruits in the basket :D
      expect(dict.getCount()).to.equal(2);
    });

    it('Should remove an existing item from the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      const clone: ClonableTest = new ClonableTest('complex', complex);
      // Adding a complex
      dict.add('complex', clone);
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('complex')).to.be.true;
      // Removing the complex
      dict.remove('complex');
      // No more fruit in the basket :(
      expect(dict.getCount()).to.equal(0);
      expect(dict.containsKey('complex')).to.be.false;
    });

    it('Should not be able remove an item that do not exist in the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      const clone: ClonableTest = new ClonableTest('banana', banana);
      // Adding a banana
      dict.add('banana', clone);
      expect(dict.containsKey('banana')).to.be.true;
      // Cannot remove a fruit that is not in the basket
      expect(dict.remove('tomato')).to.be.undefined;
      expect(dict.getCount()).to.equal(1);
      expect(dict.containsKey('banana')).to.be.true;
    });

    it('Should return an item of the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      const clone: ClonableTest = new ClonableTest('banana', banana);
      // Adding a banana
      dict.add('banana', clone);
      expect(dict.getItem('banana')).to.be.eql(clone);
      // Making sure we have a banana
      expect(dict.getItem('banana').getConfiguration()).to.be.eql(banana);
    });

    it('Should return undefined if an item do not exist in the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      const clone: ClonableTest = new ClonableTest('banana', banana);
      expect(dict.getItem('notInTheDict')).to.be.undefined;
    });

    it('Should return all the keys of the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      // Adding a bunch of fruits
      dict.add('banana', new ClonableTest('banana', banana));
      dict.add('apple', new ClonableTest('apple', apple));
      dict.add('orange', new ClonableTest('orange', orange));
      dict.add('strawberry', new ClonableTest('strawberry', strawberry));
      expect(dict.getCount()).to.equal(4);
      expect(dict.keys()).to.be.eql(['banana', 'apple', 'orange', 'strawberry']);
    });

    it('Should return all the values of the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();

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

    it('Should clears all the values of the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
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

    it('Should clones all the items of the dictionary', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: Dictionary<ClonableTest> = new Dictionary();

      // Adding a bunch of fruits
      dict.add('banana', new ClonableTest('banana', banana));
      dict.add('apple', new ClonableTest('apple', apple));
      dict.add('orange', new ClonableTest('orange', orange));

      expect(clone.getCount()).to.equal(0);
      expect(clone.values()).to.be.an('array').that.is.empty;

      // Cloning the dictionary into the clone dictionary :P
      clone = dict.clone();

      expect(clone.getCount()).to.equal(3);

      // Adding a fruit in the initial dictionary should not affect the clone
      dict.add('strawberry', new ClonableTest('strawberry', strawberry));

      expect(clone.getCount()).to.equal(3);

      expect(clone.keys()).to.be.eql(['banana', 'apple', 'orange']);
    });

    it('Should clones all the items of the dictionary - complex object', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary();
      let clone: Dictionary<ClonableTest> = new Dictionary();
      const complexClone = {
        color: 'blue',
        price: 10,
        classification: {
          category: 'Dry Fruit'
        }
      };
      // Adding a complex fruit
      dict.add('complex', new ClonableTest('complex', complexClone));

      // Cloning the dictionary into the clone dictionary :P
      clone = dict.clone();

      // making sur the initial object was correctly cloned
      complexClone.classification.category = 'Berry';

      expect(clone.getItem('complex').getConfiguration()).to.eql({
        color: 'blue',
        price: 10,
        classification: {
          category: 'Dry Fruit'
        }
      });
    });

    it('Should initialize an non empty dictionnay', () => {
      const orangeClonable = new ClonableTest('orange', orange);
      const appleClonable = new ClonableTest('apple', apple);
      const bananaClonable = new ClonableTest('banana', banana);
      const strawberryClonable = new ClonableTest('strawberry', strawberry);

      const dict: Dictionary<ClonableTest> = new Dictionary({
        orange: orangeClonable,
        apple: appleClonable,
        banana: bananaClonable,
        strawberry: strawberryClonable
      });

      expect(dict.getCount()).to.equal(4);
      expect(dict.keys()).to.be.eql(['orange', 'apple', 'banana', 'strawberry']);
      expect(dict.values()).to.be.eql([orangeClonable, appleClonable, bananaClonable, strawberryClonable]);
    });

    it('Should not initialize dictionary with an empty object', () => {
      const dict: Dictionary<ClonableTest> = new Dictionary({});
      const dict2: Dictionary<ClonableTest> = new Dictionary();

      expect(dict).to.eql(dict2);
    });

    it('Should not create a Dictionary with an object that does not implement the clone method', () => {
      const dict: Dictionary<any> = new Dictionary();
      dict.add('asd', ['cvb', 234]);
      expect(dict.clone).to.throw();
    });
  });
};
