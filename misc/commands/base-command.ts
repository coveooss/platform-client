// External packages
import * as yaml from 'js-yaml';
import * as fs from 'fs';
// Internal packages
import {Dictionary} from '../commons/collections/dictionary'
import {ICommand} from '../commons/interfaces/icommand'

export abstract class BaseCommand implements ICommand{
  public commandName:string = '';
  public mandatoryParameters:Array<string> = new Array<string>();
  public optionalParameters:Dictionary<string> = new Dictionary<string>();
  public optionalFlags:Dictionary<boolean> = new Dictionary<boolean>();
  public validations:Dictionary<string> = new Dictionary<string>();

  constructor () {}

  public Parse (elements:string[]):void {
    // Parse command name and mandatory parameters
    this.commandName = elements[0];

    for (var i = 0; i < this.mandatoryParameters.length; i++) { 
        this.mandatoryParameters[i] = elements[i+1];
    }

    // Parse optional parameters and flags
    for (var i = 1 + this.mandatoryParameters.length; i < elements.length; i++) {
      if (this.optionalFlags.ContainsKey(elements[i])) {
        this.optionalFlags.Add(elements[i], true);
      } else if (this.optionalParameters.ContainsKey(elements[i].split('=')[0])) {
        this.optionalParameters.Add(elements[i].split('=')[0], elements[i].split('=')[1]);
      } else {
        throw new Error('Unrecognize parameter ' + elements[i]);
      }
    }

    // If a configuration file have been specify, call the load function.
    if ('settings' in this.optionalParameters) {
      if (this.optionalParameters.Item('settings') != "") {
        this.LoadSettings(this.optionalParameters.Item('settings'));
      }
    }
  }

  public LoadSettings(filename:string):void {
    try {
        const settings = yaml.safeLoad(fs.readFileSync(filename, 'utf8'));
        console.log(settings);
    } catch (e) {
        console.log(e);
    }
  }

  public Validate():void {
    var errors = [];

    for (var validation in this.validations.Keys) {
      if (!eval(validation)) {
        errors.push(this.validations.Item(validation));
      }
    }

    if(errors.length > 0) {
      throw new Error(errors.join('\n\r'));
    }
  }

  abstract Execute():void;
}
