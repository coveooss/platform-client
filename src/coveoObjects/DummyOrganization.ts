import { IOrganizationOptions, Organization } from './Organization';

/**
 * Dummy organization used for uploading from local to Coveo platform
 */
export class DummyOrganization extends Organization {
  constructor(options?: IOrganizationOptions) {
    super('DUMMY ORG', 'XXX', options);
  }
}
