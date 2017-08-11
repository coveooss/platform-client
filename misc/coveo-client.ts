// Old school import so we can access the package.json file and other libraries
declare function require(name:string):any;
// External packages
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
var clear:any = require('clear');
var CLI:any = require('clui');
var figlet:any = require('figlet');
// Internal packages
import {InitializeConsole} from './console/terminal-manager';
import * as command from './commands/command-manager';
import {helpText, helpDisclaimer} from './console/help';
var pkg:any = require('./package.json');

// Clear the console and display the package name and some other information
clear();
console.log(
  chalk
    .white
    .bold(
      figlet.textSync(pkg.name, { horizontalLayout: 'full' })
    )
);
console.log('Version: %s', pkg.version);
console.log(pkg.description);
console.log(helpDisclaimer);

// Handle the commands by sending them to the parser
function processCommand() {
  if (arguments) {
      switch(arguments[0]["command"]) {
        case 'exit':
          console.log('Exiting coveo-console...');
          console.log('');
          process.exit();
        case 'help':
          console.log(helpText);
          break;
        default:
          try {
            var cmd = command.HandleCommand(arguments[0]["command"]);
          } catch (error) {
            console.log(error.message);
            console.log(helpText);
          }
      }

      InitializeConsole(processCommand);
  }
}

// Initialize the console
InitializeConsole(processCommand);