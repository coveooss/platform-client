import * as _ from 'underscore';
import { expect } from 'chai';
import { exec } from 'child_process';
import { Logger } from '../src/commons/logger';

export const ConsoleTest = () => {
  describe('Console Messages', () => {
    // TODO: should test multiple command to make sure nothing breaks
    // TODO: need to run a dev server for thos tests
    describe('diff-field command', () => {
      it('Should perform a diff-fields without error', (done: MochaDone) => {
        exec('node client.js diff-fields dev prod xxx yyy -i ds,ds,dsa', { cwd: './bin' }, (err: Error, stdout: string, stderr: string) => {
          if (err) {
            return done(err);
          }
          done();
        });
      });
    });
  });
};
