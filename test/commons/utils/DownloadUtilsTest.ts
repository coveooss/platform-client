// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import { Dictionary } from '../../../src/commons/collections/Dictionary';
import { DownloadResultArray } from '../../../src/commons/collections/DownloadResultArray';
import { DownloadUtils } from '../../../src/commons/utils/DownloadUtils';
import { Extension } from '../../../src/coveoObjects/Extension';
import { ClonableTest } from '../../commons/collections/ClonableTest';

export const DownloadUtilsTest = () => {
  describe('Get download Result', () => {
    const dict1: Dictionary<ClonableTest> = new Dictionary({
      key1: new ClonableTest('key1', [1, 'a']),
      key2: new ClonableTest('key2', [2, 'b']),
      key3: new ClonableTest('key3', [3, 'c']),
      key4: new ClonableTest('key4', [4, 'd'])
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

    const extension1Dict: Dictionary<Extension> = new Dictionary({
      'URL Parsing to extract metadata': extension1
    });

    describe('Extension download', () => {
      it('Should return one extension', () => {
        const download: DownloadResultArray = DownloadUtils.getDownloadResult(extension1Dict);
        expect(download.getCount()).to.equal(1);
      });
    });

    describe('Field download', () => {
      it('Should not alter dictionnaries', () => {
        const dict1Clone = dict1.clone();

        expect(dict1).to.eql(dict1Clone);
      });
    });
  });
};
