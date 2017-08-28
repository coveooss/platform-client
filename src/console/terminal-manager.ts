// External modules
const UI = require('readline-ui');
// Internal modules

export function InitializeConsole(callback: Function) {
  process.stdin.resume();
  console.log('');
  process.stdout.write('coveo-client# ');

  process.stdin.once('data', function (data: any) {
    if (data) {
      data = String(data).trim().toLowerCase().split(' ');
    } else {
      data = null;
    }
    callback(data);
  });
}
