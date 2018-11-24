import { Dictionary } from '../commons/collections/Dictionary';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Extension } from './Extension';
import { Field } from './Field';
import { Source } from './Source';

/**
 * Organization Class. By default, the organization instance do not contain any field, sources nor extension.
 * This is a way to prevent unecessary HTTP calls to the platform.
 * The Controllers are responsible to load those
 */
export class Organization extends BaseCoveoObject implements IOrganization {
  private fields: Dictionary<Field> = new Dictionary<Field>();
  private sources: Dictionary<Source> = new Dictionary<Source>();
  private extensions: Dictionary<Extension> = new Dictionary<Extension>();

  constructor(id: string, private apiKey: string) {
    super(id);
    this.apiKey = apiKey;
  }

  /**
   * Return the API key used for the manipulation on the Organization.
   *
   * @returns {string} API Key
   */
  getApiKey(): string {
    return this.apiKey;
  }

  /**
   * Return a copy of the Organizatio fields
   *
   * @returns {Dictionary<Field>}
   */
  getFields(): Dictionary<Field> {
    return this.fields.clone();
  }

  /**
   * Add a new field to the Organzation
   *
   * @param {Field} field Field to be added
   */
  addField(field: Field) {
    this.fields.add(field.getName(), field);
  }

  /**
   * Takes a field list and, for each item of the list, create a field that will be added to the Organization
   *
   * @param {IStringMap<any>[]} fields field list
   */
  addFieldList(fields: Array<IStringMap<any>>) {
    fields.forEach((f: IStringMap<any>) => {
      const field = new Field(f);
      this.addField(field);
    });
  }

  clearFields() {
    this.fields.clear();
  }

  getSources(): Dictionary<Source> {
    return this.sources.clone();
  }

  /**
   * Add a soucre to the Organization
   *
   * @param {Source} source Source to be added
   */
  addSource(source: Source) {
    // Using the source name as the key since the source ID is not the same from on org to another
    Assert.isUndefined(this.sources.getItem(source.getName()), `At least 2 sources are having the same name: ${source.getName()}`);
    this.sources.add(source.getName(), source);
  }

  clearSources() {
    this.sources.clear();
  }

  getExtensions(): Dictionary<Extension> {
    return this.extensions.clone();
  }

  /**
   * Add an extension to the Organization
   *
   * @param {Extension} extension Extension to be added
   */
  addExtension(extension: Extension) {
    // Using the extension name as the key since the extension ID is not the same from on org to another
    Assert.isUndefined(
      this.extensions.getItem(extension.getName()),
      `At least 2 extensions are having the same name: ${extension.getName()}`
    );
    this.extensions.add(extension.getName(), extension);
  }

  /**
   * Takes an extension list and, for each item of the list, create an extention that will be added to the Organization
   *
   * @param {IStringMap<any>[]} extensions
   */
  addMultipleExtensions(extensions: Array<IStringMap<any>>) {
    extensions.forEach((e: IStringMap<any>) => {
      const extension = new Extension(e);
      this.addExtension(extension);
    });
  }

  clearExtensions() {
    this.extensions.clear();
  }

  clone() {
    const newOrg = new Organization(this.getId(), this.getApiKey());
    // TODO: add extensions, mappings and fields
    return newOrg;
  }
}
