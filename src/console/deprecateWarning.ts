import * as boxen from 'boxen';
import { bold } from 'chalk';

export function printDeprecationWarning() {
  const message = `This package is now deprecated.\nYou can start using the official ${bold(
    '@coveo/cli'
  )} package instead.\nhttps://www.npmjs.com/package/@coveo/cli`;
  console.log(boxen(message, { padding: 1, align: 'center', borderColor: 'yellow', borderStyle: 'round' }));
}

printDeprecationWarning();
