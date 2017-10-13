export interface ICommand2 {
  commandName: string;
  description: string;
  commandOptions: ICommandOptions[];
}

export interface ICommandOptions {
  shortOption: string;
  longOption: string;
  description: string;
}
