// External packages
// Internal packages
import { GraduateCommand } from './graduateCommand';
import { DiffCommand } from './diffCommand';
import { Dictionary } from '../commons/collections/dictionary'
import { ICommand } from '../commons/interfaces/icommand'
import { BaseCommand } from './baseCommand';

// Register available commands
let commandMap: Dictionary<any> = new Dictionary<any>();
commandMap.Add(GraduateCommand.COMMAND_NAME, GraduateCommand);
commandMap.Add(DiffCommand.COMMAND_NAME, DiffCommand);

export function HandleCommand(command: string) {
  try {
    let elements: Array<string> = command.toLowerCase().split(' ');
    let cmd: ICommand;

    // Get the command...
    try {
      let aa = commandMap.Item(elements[0])
      cmd = <ICommand>(new (aa)());
    } catch (error) {
      throw new Error('Unreckognized command.');
    }

    // Parse the command
    try {
      cmd.Parse(elements);
    } catch (error) {
      throw new Error('Some of the parameters and/or flags are not valid (' + error.message + ').');
    }

    // Validate command
    try {
      cmd.Validate();
    } catch (error) {
      throw new Error('Some of the parameters and/or flags are not valid (' + error.message + ').');
    }

    try {
      // Execute the command
      cmd.Execute();
    } catch (error) {
      throw new Error('An error occured while processing the command(' + error.message + ').');
    }

    // Return the command
    // TODO: Remove this
    return cmd;
  } catch (error) {
    throw error;
  }
}