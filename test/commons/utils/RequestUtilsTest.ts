import { assert, expect } from 'chai';
import * as nock from 'nock';
import { UrlService } from '../../../src/commons/rest/UrlService';
import { RequestUtils } from './../../../src/commons/utils/RequestUtils';

export const RequestUtilsTest = () => {
  describe('Rest Utils', () => {
    let scope: nock.Scope;

    afterEach(() => {
      expect(scope.pendingMocks(), scope.pendingMocks().toString()).to.be.empty;
    });

    it('Should send an empty request', (done: Mocha.Done) => {
      scope = nock('https://custom-domain.com').get('/').reply(RequestUtils.OK);

      RequestUtils.get(UrlService.getDefaultUrl('https://custom-domain.com/'), 'xxx')
        .then(() => {
          done();
        })
        .catch((err: any) => {
          done(err);
        });
    });

    it('Should handle an error on GET method', (done: Mocha.Done) => {
      scope = nock(UrlService.getDefaultUrl()).get('/').replyWithError({ message: 'something awful happened', code: 'AWFUL_ERROR' });

      RequestUtils.get(UrlService.getDefaultUrl(), 'xxx')
        .then(() => {
          done('This function should not resolve');
        })
        .catch((err: any) => {
          assert.throws(() => {
            throw Error(err['message']);
          }, 'something awful happened');
          done();
        });
    });

    it('Should handle an error on PUT method', (done: Mocha.Done) => {
      scope = nock(UrlService.getDefaultUrl())
        .put('/cat/poems')
        .replyWithError({ message: 'something awful happened', code: 'AWFUL_ERROR' });

      RequestUtils.put(UrlService.getDefaultUrl() + '/cat/poems', 'xxx', { something: ['very', 'cool'] })
        .then(() => {
          done('This function should not resolve');
        })
        .catch((err: any) => {
          assert.throws(() => {
            throw Error(err['message']);
          }, 'something awful happened');
          done();
        });
    });

    it('Should handle an error on POST method', (done: Mocha.Done) => {
      scope = nock(UrlService.getDefaultUrl())
        .post('/the/super/org')
        .replyWithError({ message: 'something awful happened', code: 'AWFUL_ERROR' });

      RequestUtils.post(UrlService.getDefaultUrl() + '/the/super/org', 'the_super_api_key', { the: 'super content' })
        .then(() => {
          done('This function should not resolve');
        })
        .catch((err: any) => {
          assert.throws(() => {
            throw Error(err['message']);
          }, 'something awful happened');
          done();
        });
    });

    it('Should handle an error on Get method', (done: Mocha.Done) => {
      scope = nock(UrlService.getDefaultUrl())
        .delete('/somthing/to/delete')
        .replyWithError({ message: 'something awful happened', code: 'AWFUL_ERROR' });

      RequestUtils.delete(UrlService.getDefaultUrl() + '/somthing/to/delete', 'xxx')
        .then(() => {
          done('This function should not resolve');
        })
        .catch((err: any) => {
          assert.throws(() => {
            throw Error(err['message']);
          }, 'something awful happened');
          done();
        });
    });
  });
};
