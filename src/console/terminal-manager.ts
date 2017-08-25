// import * as inquirer from 'inquirer';
// const Prompt = require('../vendor/modified-inquirer-prompt/prompt.js');
const UI = require('readline-ui');

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

  process.stdin.on('keypress', function (char: any, key: any) {
    process.stdout.write('1');
  });

  /*
  let promptConfig = [
    {
      name: 'command',
      type: 'input',
      message: 'coveo-client>',
      validate(value: string) {
        if (value) {
          return true;
        } else {
          return 'Please enter a command...';
        }
      }
    }
  ];

  console.log('');

  inquirer
    .prompt(promptConfig)
    .then(callback);
  */
}
