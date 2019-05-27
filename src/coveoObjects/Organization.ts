import * as _ from 'underscore';
import { Dictionary } from '../commons/collections/Dictionary';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { IStringMap } from '../commons/interfaces/IStringMap';
import { Assert } from '../commons/misc/Assert';
import { BaseCoveoObject } from './BaseCoveoObject';
import { Extension } from './Extension';
import { Field } from './Field';
import { Source } from './Source';
import { Pipeline } from './Pipeline';
import { StringUtil } from '../commons/utils/StringUtils';

// Blacklist all the objects that we do not want to add to the organization.
export interface IBlacklistObjects {
  fields?: string[];
  extensions?: string[];
  sources?: string[];
  pipelines?: string[];
}

/**
 * Organization Class. By default, the organization instance do not contain any field, sources nor extension.
 * This is a way to prevent unecessary HTTP calls to the platform.
 * The Controllers are responsible to load those
 */
export class Organization extends BaseCoveoObject implements IOrganization {
  private fields: Dictionary<Field> = new Dictionary<Field>();
  private sources: Dictionary<Source> = new Dictionary<Source>();
  private extensions: Dictionary<Extension> = new Dictionary<Extension>();
  private pipelines: Dictionary<Pipeline> = new Dictionary<Pipeline>();

  constructor(id: string, private apiKey: string, private blacklist: IBlacklistObjects = {}) {
    super(id);
    this.apiKey = apiKey;

    this.blacklist.extensions = _.map(this.blacklist.extensions || [], e => StringUtil.lowerAndStripSpaces(e));
    this.blacklist.fields = _.map(this.blacklist.fields || [], f => StringUtil.lowerAndStripSpaces(f));
    this.blacklist.sources = _.map(this.blacklist.sources || [], s => StringUtil.lowerAndStripSpaces(s));
    this.blacklist.pipelines = _.map(this.blacklist.pipelines || [], p => StringUtil.lowerAndStripSpaces(p));
  }

  getExtensionBlacklist(): string[] {
    return this.blacklist.extensions || [];
  }

  getfieldBlacklist(): string[] {
    return this.blacklist.fields || [];
  }

  getSourceBlacklist(): string[] {
    return this.blacklist.sources || [];
  }

  getPipelineBlacklist(): string[] {
    return this.blacklist.pipelines || [];
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
    if (!_.contains(this.getfieldBlacklist(), StringUtil.lowerAndStripSpaces(field.getName()))) {
      this.fields.add(field.getName(), field);
    }
  }

  /**
   * Takes a field list and, for each item of the list, create a field that will be added to the Organization
   *
   * @param {IStringMap<any>[]} fields field list
   */
  addFieldList(fields: Array<IStringMap<any>>) {
    fields.forEach((f: IStringMap<any>) => {
      const field = new Field(f);
      if (!_.contains(this.getfieldBlacklist() || [], StringUtil.lowerAndStripSpaces(field.getName()))) {
        this.addField(field);
      }
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
    if (!_.contains(this.getSourceBlacklist() || [], StringUtil.lowerAndStripSpaces(source.getName()))) {
      this.sources.add(source.getName(), source);
    }
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
    if (!_.contains(this.getExtensionBlacklist() || [], StringUtil.lowerAndStripSpaces(extension.getName()))) {
      this.extensions.add(extension.getName(), extension);
    }
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

  /**
   * Return a copy of the Organization pipelines
   *
   * @returns {Dictionary<Pipeline>}
   */
  getPipelines(): Dictionary<Pipeline> {
    return this.pipelines.clone();
  }

  /**
   * Add a new pipeline to the Organzation
   *
   * @param {Pipeline} pipeline Pipeline to be added
   */
  addPipeline(pipeline: Pipeline) {
    if (!_.contains(this.getPipelineBlacklist(), StringUtil.lowerAndStripSpaces(pipeline.getName()))) {
      this.pipelines.add(pipeline.getName(), pipeline);
    }
  }

  /**
   * Takes a pipeline list and, for each item of the list, create a pipeline that will be added to the Organization
   *
   * @param {IStringMap<any>[]} pipelines pipeline list
   */
  addPipelineList(pipelines: Array<IStringMap<any>>) {
    pipelines.forEach((p: IStringMap<any>) => {
      const pipeline = new Pipeline(p);
      if (!_.contains(this.getPipelineBlacklist() || [], StringUtil.lowerAndStripSpaces(pipeline.getName()))) {
        this.addPipeline(pipeline);
      }
    });
  }

  /**
   * Updates the pipeline with its statements
   *
   * @param {Pipeline} pipeline updated pipeline
   */
  updatePipeline(pipeline: Pipeline) {
    this.getPipelines().remove(pipeline.getName());
    this.addPipeline(pipeline);
  }

  clearPipelines() {
    this.pipelines.clear();
  }

  clearAll() {
    this.clearExtensions();
    this.clearFields();
    this.clearSources();
  }

  clone() {
    const newOrg = new Organization(this.getId(), this.getApiKey());
    _.each(this.fields.values(), (field: Field) => {
      newOrg.addField(field.clone());
    });
    _.each(this.extensions.values(), (extension: Extension) => {
      newOrg.addExtension(extension.clone());
    });
    _.each(this.sources.values(), (source: Source) => {
      newOrg.addSource(source.clone());
    });

    return newOrg;
  }
}
