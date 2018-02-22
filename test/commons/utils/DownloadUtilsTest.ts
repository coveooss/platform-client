// tslint:disable:no-magic-numbers
import { IDiffOptions } from './../../../src/commands/DiffCommand';
import { expect } from 'chai';
import { DownloadUtils } from '../../../src/commons/utils/DownloadUtils';
import { Dictionary } from '../../../src/commons/collections/Dictionary';
import { DownloadResultArray } from '../../../src/commons/collections/DownloadResultArray';
import { Extension } from '../../../src/coveoObjects/Extension';
import { ClonableTest } from '../../commons/collections/ClonableTest';
import * as _ from 'underscore';

class Car {
  constructor(public brand: string, public color: string) {}
}

export const DownloadUtilsTest = () => {
  describe('Get download Result', () => {
    const getConfiguration = (o: ClonableTest) => o.getConfiguration();

    const car1 = new Car('Tesla', 'red');
    const car2 = new Car('Audi', 'black');
    const car3 = new Car('bmw', 'blue');
    const car4 = new Car('Tesla', 'white');
    const car5 = new Car('Audi', 'green');
    const car6 = new Car('bmw', 'yellow');

    const dict1: Dictionary<ClonableTest> = new Dictionary({
      key1: new ClonableTest('key1', [1, 'a']),
      key2: new ClonableTest('key2', [2, 'b']),
      key3: new ClonableTest('key3', [3, 'c']),
      key4: new ClonableTest('key4', [4, 'd'])
    });

    const dict2: Dictionary<ClonableTest> = new Dictionary({
      key3: new ClonableTest('key3', [3, 'c']),
      key2: new ClonableTest('key2', [2, 'b']),
      key1: new ClonableTest('key1', [1, 'a']),
      key4: new ClonableTest('key4', [4, 'd'])
    });

    const dictDeleted: Dictionary<ClonableTest> = new Dictionary({
      key2: new ClonableTest('key2', [2, 'b']),
      key4: new ClonableTest('key4', [4, 'd'])
    });

    const dictUpdated: Dictionary<ClonableTest> = new Dictionary({
      key3: new ClonableTest('key3', [3, 'c']),
      key1: new ClonableTest('key1', [1, 'aaa']),
      key2: new ClonableTest('key2', [2, 'bb']),
      key4: new ClonableTest('key4', [22, 'd'])
    });

    const dictCreated: Dictionary<ClonableTest> = new Dictionary({
      key4: new ClonableTest('key4', [4, 'd']),
      key1: new ClonableTest('key1', [1, 'a']),
      key5: new ClonableTest('key5', [5, 'e']),
      key2: new ClonableTest('key2', [2, 'b']),
      key3: new ClonableTest('key3', [3, 'c']),
      key6: new ClonableTest('key6', [6, 'f'])
    });

    const dictAll: Dictionary<ClonableTest> = new Dictionary({
      key1: new ClonableTest('key1', [11, 'a']),
      Charizard: new ClonableTest('Charizard', [6, 'fire']),
      key4: new ClonableTest('key4', [4, 'd']),
      key2: new ClonableTest('key2', [2, 'b']),
      Sandshrew: new ClonableTest('Sandshrew', [27, 'ground'])
    });

    const car1Dict: Dictionary<ClonableTest> = new Dictionary({
      car1: new ClonableTest(car1.brand, car1),
      car2: new ClonableTest(car2.brand, car2),
      car3: new ClonableTest(car3.brand, car3)
    });

    const car2Dict: Dictionary<ClonableTest> = new Dictionary({
      car1: new ClonableTest(car4.brand, car4),
      car2: new ClonableTest(car5.brand, car5),
      car3: new ClonableTest(car6.brand, car6)
    });

    const extension1: Extension = new Extension({
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

    const extension2: Extension = new Extension({
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

    const extension1Dict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension1
    });

    const extension1CopyDict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension1
    });

    const extension2Dict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension2
    });

    describe('Extension download', () => {
      it('Should return one extension', () => {
        const download: DownloadResultArray<Extension> = DownloadUtils.getDownloadResult(extension1Dict);
        expect(download.ITEMS.length).to.equal(1);
      });
    });

    describe('Field download', () => {
      it('Should not alter dictionnaries', () => {
        const dict1Clone = dict1.clone();

        const download: DownloadResultArray<ClonableTest> = DownloadUtils.getDownloadResult(dict1Clone);

        expect(dict1).to.eql(dict1Clone);
      });
    });
  });
};
