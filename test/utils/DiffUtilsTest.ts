import { expect, should } from 'chai';
import { DiffUtils, IDiffOptions } from '../../src/commons/utils/DiffUtils';
import { Dictionary } from '../../src/commons/collections/Dictionary';
import { DiffResultArray } from '../../src/commons/collections/DiffResultArray';
import { Extension } from '../../src/coveoObjects/Extension';

export const DiffUtilsTest = () => {
  describe('Get Diff Result', () => {

    let dict1: Dictionary<any> = new Dictionary();
    dict1.add('key1', [1, 'a']);
    dict1.add('key2', [2, 'b']);
    dict1.add('key3', [3, 'c']);
    dict1.add('key4', [4, 'd']);

    let dict2: Dictionary<any> = new Dictionary({
      key3: [3, 'c'],
      key2: [2, 'b'],
      key1: [1, 'a'],
      key4: [4, 'd']
    });

    let dictDeleted: Dictionary<any> = new Dictionary({
      key2: [2, 'b'],
      key4: [4, 'd']
    });

    let dictUpdated: Dictionary<any> = new Dictionary({
      key3: [3, 'c'],
      key1: [1, 'aaa'],
      key2: [2, 'bb'],
      key4: [22, 'd']
    });

    let dictCreated: Dictionary<any> = new Dictionary({
      key4: [4, 'd'],
      key1: [1, 'a'],
      key5: [5, 'e'],
      key2: [2, 'b'],
      key3: [3, 'c'],
      key6: [6, 'f']
    });

    let dictAll: Dictionary<any> = new Dictionary({
      key1: [11, 'a'],
      Charizard: [6, 'fire'],
      key4: [4, 'd'],
      key2: [2, 'b'],
      Sandshrew: [27, 'ground']
    });

    let car1Dict: Dictionary<{ brand: string, color: string }> = new Dictionary({
      car1: { brand: 'Tesla', color: 'red' },
      car2: { brand: 'Audi', color: 'black' },
      car3: { brand: 'bmw', color: 'blue' }
    });

    let car2Dict: Dictionary<{ brand: string, color: string }> = new Dictionary({
      car1: { brand: 'Ford', color: 'white' },
      car2: { brand: 'Dodge', color: 'green' },
      car3: { brand: 'Ferrari', color: 'yellow' }
    });

    let extension1: Extension = new Extension('URL Parsing to extract metadata', {
      content: 'random content',
      createdDate: 1511812769000,
      description: 'This extension is used to parse urls to extract metadata like categories.',
      enabled: true,
      id: 'ccli1wq3fmkys-sa2fjv3lwf67va2pbiztb22fsu',
      lastModified: 1511812770000,
      name: 'URL Parsing to extract metadata',
      requiredDataStreams: [],
      versionId: 'hwnahJ9mql3cBB4PH6qG_9yXEwwFEhgX',
      usedBy: [],
      status: {
        durationHealth: {
          healthIndicator: 'UNKNOWN'
        },
        dailyStatistics: {
          averageDurationInSeconds: 0,
          numberOfErrors: 0,
          numberOfExecutions: 0,
          numberOfSkips: 0,
          numberOfTimeouts: 0
        },
        disabledStatus: {},
        timeoutHealth: {
          healthIndicator: 'UNKNOWN'
        }
      }
    });

    let extension2: Extension = new Extension('URL Parsing to extract metadata', {
      content: '# Title: Reject a document.\n# Description: This extension simply rejects a document.\n',
      createdDate: 1511812764000,
      description: 'This extension simply rejects a document. It gets triggered on certain file types in the source configuration',
      enabled: true,
      id: 'ccli1wq3fmkys-tknepx33tdhmqibch2uzxhcc44',
      lastModified: 1511812764000,
      name: 'Reject a document.',
      requiredDataStreams: [],
      versionId: 'a6LyFxn91XW5IcgNMTKOabXcJWp05e7i',
      usedBy: [],
      status: {
        durationHealth: {
          healthIndicator: 'UNKNOWN'
        },
        dailyStatistics: {
          averageDurationInSeconds: 0,
          numberOfErrors: 0,
          numberOfExecutions: 0,
          numberOfSkips: 0,
          numberOfTimeouts: 0
        },
        disabledStatus: {},
        timeoutHealth: {
          healthIndicator: 'UNKNOWN'
        }
      }
    });

    let extension1Dict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension1
    });

    let extension1CopyDict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension1
    });

    let extension2Dict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension2
    });

    describe('Extension Diff', () => {

      it('Should return one updated extension', () => {
        let dict1Clone = extension1Dict.clone();
        let dict2Clone = extension2Dict.clone();

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1Clone, dict2Clone);
        expect(diff.UPDATED.length).to.equal(1);
        expect(diff.NEW.length).to.equal(0);
        expect(diff.DELETED.length).to.equal(0);
      });

      it('Should return no modification', () => {
        let dict1Clone = extension1Dict.clone();
        let dict2Clone = extension1CopyDict.clone();

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1Clone, dict2Clone);
        expect(diff.UPDATED.length).to.equal(0);
        expect(diff.NEW.length).to.equal(0);
        expect(diff.DELETED.length).to.equal(0);
      });

      it('Should return 2 new extensions', () => {
        let dict: Dictionary<Extension> = new Dictionary();
        let dict2Clone = new Dictionary();
        dict.add('first extension', extension1);
        dict.add('second extension', extension2);

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict, dict2Clone);
        expect(diff.UPDATED.length).to.equal(0);
        expect(diff.NEW.length).to.equal(2);
        expect(diff.DELETED.length).to.equal(0);
      });

      it('Should return 2 deleted extensions', () => {
        let dict: Dictionary<Extension> = new Dictionary();
        let dict2Clone = new Dictionary();
        dict.add('first extension', extension1);
        dict.add('second extension', extension2);

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict2Clone, dict);
        expect(diff.UPDATED.length).to.equal(0);
        expect(diff.NEW.length).to.equal(0);
        expect(diff.DELETED.length).to.equal(2);
      });

    });

    describe('Field Diff', () => {

      it('Should not alter dictionnaries', () => {
        let dict1Clone = dict1.clone();
        let dictAllClone = dictAll.clone();

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dictAll);

        expect(dict1).to.eql(dict1Clone);
        expect(dictAll).to.eql(dictAllClone);
      });

      it('Should not return any differences', () => {
        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dict2);
        expect(diff.containsItems()).to.be.false;
      });

      it('Should return the new items', () => {
        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dictDeleted);
        expect(diff.containsItems()).to.be.true;
        expect(diff.NEW).to.eql([[1, 'a'], [3, 'c']]);
      });

      it('Should return the updated items', () => {
        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dictUpdated);
        expect(diff.containsItems()).to.be.true;
        expect(diff.UPDATED).to.eql([[1, 'a'], [2, 'b'], [4, 'd']]);
      });

      it('Should return the deleted items', () => {
        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dictCreated);
        expect(diff.containsItems()).to.be.true;
        expect(diff.DELETED).to.eql([[5, 'e'], [6, 'f']]);
      });

      it('Should return all modifications', () => {
        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(dict1, dictAll);
        expect(diff.containsItems()).to.be.true;

        expect(diff.NEW).to.eql([[3, 'c']]);
        expect(diff.UPDATED).to.eql([[1, 'a']]);
        expect(diff.DELETED).to.eql([[6, 'fire'], [27, 'ground']]);
      });

      it('Adding fields to ignore should not alter initial object', () => {
        let options: IDiffOptions = {
          keysToIgnore: ['random']
        };

        let car1DictClone = car1Dict.clone();
        let car2DictClone = car2Dict.clone();

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(car1DictClone, car2DictClone, options);
        expect(car1Dict).to.eql(car1DictClone);
        expect(car2Dict).to.eql(car2DictClone);
      });

      it('Should return the diff result without ignore fields', () => {
        let options: IDiffOptions = {
          keysToIgnore: ['color']
        };

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(car1Dict, car2Dict, options);
        expect(diff.containsItems()).to.be.true;
        expect(diff.UPDATED).to.eql(
          [
            { brand: 'Tesla' },
            { brand: 'Audi' },
            { brand: 'bmw' }
          ]);
      });

      it('Should not alter object when all fields are removed', () => {
        let options: IDiffOptions = {
          keysToIgnore: ['color', 'brand']
        };

        let car1DictClone = car1Dict.clone();
        let car2DictClone = car2Dict.clone();

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(car1DictClone, car2DictClone, options);
        expect(car1Dict).to.eql(car1DictClone);
        expect(car2Dict).to.eql(car2DictClone);
      });

      it('Should return the diff result without ignore fields 2', () => {
        let options: IDiffOptions = {
          keysToIgnore: ['color', 'brand']
        };

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(car1Dict, car2Dict, options);
        expect(diff.containsItems()).to.be.true;
        expect(diff.UPDATED).to.eql([{}, {}, {}]);
      });

      it('Should return the diff result without ignore fields 3', () => {
        let options: IDiffOptions = {
          keysToIgnore: ['rambo 3']
        };

        let diff: DiffResultArray<any> = DiffUtils.getDiffResult(car1Dict, car2Dict, options);
        expect(diff.containsItems()).to.be.true;

        expect(diff.UPDATED).to.eql(
          [
            { brand: 'Tesla', color: 'red' },
            { brand: 'Audi', color: 'black' },
            { brand: 'bmw', color: 'blue' }
          ]);
      });
    });
  });
};
