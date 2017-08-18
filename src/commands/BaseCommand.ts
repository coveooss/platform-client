// External packages
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as _ from 'underscore';
// Internal packages
import { Dictionary } from '../commons/collections/Dictionary'
import { ICommand } from '../commons/interfaces/ICommand'

export abstract class BaseCommand implements ICommand {
  static COMMAND_NAME: string = 'base';

  protected mandatoryParameters: Array<string> = new Array<string>();
  protected optionalParameters: Dictionary<string> = new Dictionary<string>();
  protected optionalFlags: Dictionary<boolean> = new Dictionary<boolean>();
  protected validations: Dictionary<string> = new Dictionary<string>();

  constructor() { }

  public Parse(elements: string[]): void {
    this.parseMandatoryParameters(elements);
    this.parseOptionalParametersAndFlags(elements);
    // If a configuration file have been specify, call the load function.
    if ('settings' in this.optionalParameters && this.optionalParameters.Item('settings')) {
      this.LoadSettings(this.optionalParameters.Item('settings'));
    }
  }

  private parseMandatoryParameters(elements: string[]) {
    for (let i = 0; i < this.mandatoryParameters.length; i++) {
      this.mandatoryParameters[i] = elements[i + 1];
    }
  }

  private parseOptionalParametersAndFlags(elements: string[]) {
    for (let i = 1 + this.mandatoryParameters.length; i < elements.length; i++) {
      if (this.optionalFlags.ContainsKey(elements[i])) {
        this.optionalFlags.Add(elements[i], true);
      } else if (this.optionalParameters.ContainsKey(elements[i].split('=')[0])) {
        this.optionalParameters.Add(elements[i].split('=')[0], elements[i].split('=')[1]);
      } else {
        throw new Error('Unrecognize parameter ' + elements[i]);
      }
    }
  }

  public LoadSettings(filename: string): void {
    try {
      const settings = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
      // TODO: Load the values for real
      console.log(settings);
    } catch (e) {
      console.log('Unable to load seetings!');
      console.log(e);
    }
  }

  public Validate(): void {
    let errors:Array<string> = [];
    let validations = this.validations
    let command = this;

    this.validations.Keys().forEach(function (validation) {
      // tslint:disable-next-line:no-eval
      if (!eval(validation)) {
        errors.push(validations.Item(validation));
      }
    });

    if (errors.length > 0) {
      throw new Error(errors.join('\n\r'));
    }
  }

  abstract Execute(): void;
}
