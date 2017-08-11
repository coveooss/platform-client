import * as inquirer from 'inquirer';

export function InitializeConsole(callback:any) {
  var promptText = [
    {
      name: 'command',
      type: 'input',
      message: 'coveo-client>',
      validate: function( value:string ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a command...';
        }
      }
    }
  ];

  console.log('');
  inquirer.prompt(promptText).then(callback);
}
