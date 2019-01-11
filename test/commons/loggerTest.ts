// tslint:disable:no-magic-numbers
import { expect } from 'chai';
import * as fs from 'fs-extra';
import * as _ from 'underscore';
import { Logger, LoggerSingleton } from '../../src/commons/logger';

export const LoggerTest = () => {
  describe('Logger', () => {
    const TEST_FILE = 'testfile.log';

    beforeEach(() => {
      fs.removeSync(TEST_FILE);
    });

    afterEach(() => {
      fs.removeSync(TEST_FILE);
    });

    describe('Filename setup', () => {
      it('Should set a valid filename', () => {
        Logger.setFilename(TEST_FILE);
        expect(Logger.getFilename()).to.equal(TEST_FILE);
      });

      // it('Should not set an invalid filename', () => {
      //   expect(() => Logger.setFilename(undefined)).to.throw();
      // });
    });

    describe('Log Level setup', () => {
      it('Should set the log level', () => {
        Logger.setLogLevel('error');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.ERROR);
        Logger.setLogLevel('verbose');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.VERBOSE);
        Logger.setLogLevel('insane');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.INSANE);
        Logger.setLogLevel('nothing');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.NOTHING);
        Logger.setLogLevel('info');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.INFO);
      });

      it('Should not set the log level if invalid', () => {
        Logger.setLogLevel('invalidLogLevel');
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.INFO);
      });
    });

    describe('Toggling logger', () => {
      it('Should set log level to nothing', () => {
        Logger.disable();
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.NOTHING);
      });

      it('Should set log level back to info', () => {
        Logger.enable();
        expect(Logger.getLogLevel()).to.equal(LoggerSingleton.INFO);
      });
    });

    describe('Should sew Action Method', () => {
      it('Should append a new action to the log file', (done: MochaDone) => {
        Logger.newAction('Test Action')
          .then(() => {
            const content = `${fs.readFileSync(TEST_FILE)}`;
            const contentArray = _.compact(content.split('\n'));
            expect(contentArray[0]).to.match(/\#*/);
            expect(contentArray[1]).to.equal('Test Action');
            expect(contentArray[3]).to.match(/\#*/);
            done();
          })
          .catch((err: any) => done(err));
      });
    });
  });
};
