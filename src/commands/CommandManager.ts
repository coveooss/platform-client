// External packages
// Internal packages
// import { GraduateCommand } from './GraduateCommand';
import { DiffCommand } from './DiffCommand';
import { Dictionary } from '../commons/collections/Dictionary';
import { ICommand } from '../commons/interfaces/ICommand';

// Register available commands
let commandMap: Dictionary<any> = new Dictionary<any>();
// commandMap.Add(GraduateCommand.COMMAND_NAME, GraduateCommand);
// commandMap.Add(DiffCommand.COMMAND_NAME, DiffCommand);

export function HandleCommand(command: string[]) {
  try {
    let cmd: ICommand;

    // Get the command...
    try {
      let requestedCommand = commandMap.Item(command[0]);
      cmd = (new (requestedCommand)()) as ICommand;
    } catch (error) {
      throw new Error('Unreckognized command.');
    }

    // Parse the command
    try {
      cmd.Parse(command);
    } catch (error) {
      throw new Error('Some of the parameters and/or flags are not valid (' + error.message + ').');
    }

    // Validate command
    try {
      cmd.Validate();
    } catch (error) {
      throw new Error('Some of the validations failed (' + error.message + ').');
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
