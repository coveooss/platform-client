// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as nock from 'nock';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from '../../../src/commons/utils/RequestUtils';
import { Organization } from '../../../src/coveoObjects/Organization';
import { PipelineAPI } from '../../../src/commons/rest/PipelineAPI';

export const PipelineAPITest = () => {
  describe('Pipeline API', () => {
    // const pipelineList = [];

    let scope: nock.Scope;

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    it('Should load all pipelines from the organization', (done: MochaDone) => {
      const organization: Organization = new Organization('hello', 'xxx-xxx');
      scope = nock(UrlService.getPipelineBaseUrl())
        // First expected request
        .get('')
        .query({ page: 0, perPage: 1000, organizationId: organization.getId() })
        .reply(RequestUtils.OK, [
          {
            id: '1aad28a9-3e55-4817-bb71-233fa5d8d514',
            name: 'default',
            isDefault: true,
            description: null,
            filter: null,
            splitTestName: null,
            splitTestTarget: null,
            splitTestRatio: null,
            splitTestEnabled: false,
            condition: null,
            position: 1,
            last_modified_by: null,
            created_by: null
          }
        ])
        .get('/1aad28a9-3e55-4817-bb71-233fa5d8d514/statements?organizationId=hello')
        .reply(RequestUtils.OK, {
          statements: [
            {
              id: '329ada65-e447-4773-bf36-bd76138bb0a9',
              description: '',
              feature: 'stop',
              definition: 'stop "tester"',
              position: 1,
              ready: false,
              detailed: {
                words: ['tester']
              },
              childrenCount: 0
            },
            {
              id: 'b99ef3ef-4d65-4000-9f34-bbecbdf32d6b',
              description: '',
              feature: 'stop',
              definition: 'stop "magic"',
              position: 2,
              ready: false,
              detailed: {
                words: ['magic']
              },
              childrenCount: 0
            }
          ]
        });

      PipelineAPI.loadPipelines(organization)
        .then(() => {
          expect(organization.getPipelines().getCount()).to.eql(1);
          expect(
            organization
              .getPipelines()
              .getItem('default')
              .getFieldModel()['statements'].length
          ).to.eql(2);
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });
  });
};
