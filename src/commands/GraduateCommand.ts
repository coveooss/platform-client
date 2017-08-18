// External packages
// Internal packages
import { BaseCommand } from './BaseCommand';
import { ICommand } from '../commons/interfaces/ICommand';

// Command class
export class GraduateCommand extends BaseCommand implements ICommand {
  // Command name
  static COMMAND_NAME: string = 'graduate';

  constructor() {
    super();

    this.mandatoryParameters.push('originOrganization');
    this.mandatoryParameters.push('destinationOrganization');

    this.optionalParameters.Add('settings', '');
    this.optionalParameters.Add('originapikey', '');
    this.optionalParameters.Add('destinationapikey', '');

    this.validations.Add('(command.optionalParameters.Item("originapikey") != "")',
      'Need an API key for the origin organization (originApiKey), as a parameter or in the settings file');
    this.validations.Add('(command.optionalParameters.Item("destinationapikey") != "")',
      'Need an API key for the destination organization (destinationApiKey), as a parameter or in the settings file');

  }

  public Execute() { }

}

