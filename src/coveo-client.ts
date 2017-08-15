// Old school import so we can access the package.json file and other libraries
declare function require(name: string): any;
// External packages
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
let clear: any = require('clear');
let CLI: any = require('clui');
let figlet: any = require('figlet');
import { config } from './config/index';
// Internal packages
import { InitializeConsole } from './console/terminal-manager';
import * as command from './commands/CommandManager';
import { helpText, helpDisclaimer } from './console/help';
let pkg: any = require('./../package.json');

// Clear the console and display the package name and some other information
clear();
console.log(
  chalk
    .white
    .bold(
    figlet.textSync('COVEO-client', { horizontalLayout: 'full' })
    )
);
console.log('Version: %s', pkg.version);
console.log(pkg.description);
console.log(helpDisclaimer);
if (config.env !== 'production') {
  console.log(chalk[config.color]('Environment:', config.env));
}

// Handle the commands by sending them to the parser
function processCommand() {
  if (arguments) {
    switch (arguments[0]['command']) {
      case 'exit':
        console.log('Exiting coveo-console...');
        console.log('');
        process.exit();
        break
      case 'help':
        console.log(helpText);
        break;
      default:
        try {
          let cmd = command.HandleCommand(arguments[0]['command']);
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
