import * as sinon from 'sinon';
import * as nock from 'nock';
import * as request from 'request';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { expect } from 'chai';
import { RequestUtils } from './../../../src/commons/utils/RequestUtils';
import { TestExpectedRequestAndResponse } from '../../../src/commands/TestExpectedRequestAndResponse';

export const RequestUtilsTest = () => {
  describe('Rest Utils', () => {
    before(() => {
      // stub = sinon.stub(http, 'request');
    });

    after(() => {
      // stub.restore();
    });

    it('Should send an empty request', (done: MochaDone) => {
      nock(UrlService.getDefaultUrl())
        .get('/somewhere')
        .reply(RequestUtils.OK);

      const get = sinon.spy(RequestUtils, 'get');

      RequestUtils.get(UrlService.getDefaultUrl('/somewhere'), 'xxx')
        .then(() => {
          done();
        })
        .catch((err: any) => {
          done(err);
        });

      const args = get.getCall(0).args;
      expect(get.calledOnce).to.be.true;
      expect(args[0]).to.eql(UrlService.getDefaultUrl('/somewhere'));
      expect(args[1]).to.eql('xxx');

      get.restore();
    });
  });
};
