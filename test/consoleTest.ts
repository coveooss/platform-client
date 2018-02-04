import * as _ from 'underscore';
import { expect } from 'chai';
import { exec } from 'child_process';
import { Logger } from '../src/commons/logger';

export const ConsoleTest = () => {
  describe('Console Messages', () => {
    // TODO: make sure the program exit after an amount of time
    // TODO: should test multiple command to make sure nothing breaks
    it('Should not throw any error', () => {
      Logger.enable();
      exec('node coveo-client.js diff dev prod xxx yyy -s -f', { cwd: './bin' }, (err: Error, stdout: string, stderr: string) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(stdout);
      });
    });
  });
};
