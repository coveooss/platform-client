import { BaseCommand } from './BaseCommand';
import { IOrganization } from '../commons/interfaces/IOrganization';
import { Organization } from '../models/OrganizationModel';
import { FieldController } from '../controllers/FieldController';
import { UrlService } from '../commons/services/UrlService';

export class GraduateCommand {
  private organization1: IOrganization;
  private organization2: IOrganization;

  constructor(
    originOrganization: string,
    destinationOrganization: string,
    originApiKey: string,
    destinationApiKey: string,
  ) {
    this.organization1 = new Organization(originOrganization, originApiKey);
    this.organization2 = new Organization(destinationOrganization, destinationApiKey);
  }

  public graduateFields() {
    let fieldController: FieldController = new FieldController();
    let graduation = fieldController.graduate(this.organization1, this.organization2);

    // TODO: print response of graduation command
    
  }

  public graduateSources() {

  }

  public graduateExtensions() {

  }

}

