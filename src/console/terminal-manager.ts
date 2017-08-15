import * as inquirer from 'inquirer';

export function InitializeConsole(callback: () => void) {
  let promptText = [
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
    .prompt(promptText)
    .then(callback);
}
