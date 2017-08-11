// External packages
// Internal packages
import * as GraduateCommand from './graduate-command';
import * as DiffCommand from './diff-command';
import {Dictionary} from '../commons/collections/dictionary'
import {ICommand} from '../commons/interfaces/icommand'

// Register available commands
var commandMap:Dictionary<any> = new Dictionary<any>();
commandMap.Add(GraduateCommand.COMMAND_NAME, GraduateCommand.GraduateCommand);
commandMap.Add(DiffCommand.COMMAND_NAME, DiffCommand.DiffCommand);

export function HandleCommand(command:string) {
  try {
    var elements:Array<string> = command.toLowerCase().split(' ');
    var cmd:ICommand;

    // Get the command...
    try {
      cmd = <ICommand>(new (<any>commandMap.Item(elements[0]))());
    } catch (error) {
      throw new Error('Unreckognized command.');
    }

    // Parse the command
    try {
      cmd.Parse(elements);
    } catch (error) {
      throw new Error('Some of the parameters and/or flags are not valid (' + error.message + ').');
    }

    // Validatee command
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
