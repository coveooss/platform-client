// Old school import so we can access the package.json file and other libraries
declare function require(name: string): any;
// External packages
import * as chalk from 'chalk';
import * as inquirer from 'inquirer';
let clear: any = require('clear');
let CLI: any = require('clui');
let figlet: any = require('figlet');
import * as storage from 'node-persist';
// Internal packages
import { InitializeConsole } from './console/terminal-manager';
import * as command from './commands/CommandManager';
import { helpText, helpDisclaimer } from './console/help';
import { Logger } from './commons/logger';
import { config } from './config/index';
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
  console.log(chalk.white('Environment:', config.env));
}

let commandHistory: Array<string> = new Array<string>();

// Handle the commands by sending them to the parser
function processCommand(parametersList: Array<string>) {
  if (parametersList) {
    addToHistory(parametersList.join(' '));
    switch (parametersList[0]) {
      case 'exit':
        console.log('Exiting coveo-console...');
        console.log('');
        process.exit();
        break
      // TODO: Convertir en commande...
      case 'history':
        if (parametersList.length === 1) {
          showHistory();
        } else {
          try {
            let selectedCommand: number = Number(parametersList[1])

            let commandToExecute: Array<string> = commandHistory[selectedCommand].split(' ');
            if (commandToExecute[0] === 'help') {
              displayHelp();
            } else {
              let cmd = command.HandleCommand(commandToExecute);
            }
          } catch (error) {
            Logger.error(error.message);
          }
        }
        break;
      // TODO: Convertir en commande...
      case 'help':
        displayHelp();
        break;
      default:
        try {
          let cmd = command.HandleCommand(parametersList);
        } catch (error) {
          Logger.error(error.message);
          console.log(helpDisclaimer);
        }
    }

    InitializeConsole(processCommand);
  }
}

function addToHistory(commandText: string): void {
  if (commandText.toLowerCase().substring(0, 7) === 'history') {
    return;
  }

  commandHistory.reverse();
  commandHistory.push(commandText);
  if (commandHistory.length > 5) {
    commandHistory.splice(0, commandHistory.length - 5);
  }
  commandHistory.reverse();

  storage.setItem('command_history', commandHistory);
  storage.persist();
}

function showHistory(): void {
  if (commandHistory.length > 0) {
    console.log('Please enter "history" AND the number of the command you wish to execute, then "enter". Ex.: "history 1"');
    console.log('');
  }

  for (let index = 0; index < commandHistory.length; index++) {
    console.log(`[${index}] ${commandHistory[index]}`)
  }
}

function displayHelp(): void {
  console.log(helpText);
}

// Initialize the console
storage.initSync({
	dir: './storage',
	stringify: JSON.stringify,
	parse: JSON.parse,
	encoding: 'utf8',
	logging: false,
	continuous: true,
	interval: false,
  ttl: false
});

if (storage.keys().indexOf('command_history') > -1) {
    commandHistory = storage.getItemSync('command_history');
}

InitializeConsole(processCommand);
