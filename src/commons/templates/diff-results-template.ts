// External packages
import * as ejs from 'ejs';
import * as fs from 'fs-extra';
// Internal packages
import { StringUtils } from '../utils/StringUtils';
import { DiffResult } from '../../models/DiffResult';

export function DiffResultsPageHtmlTemplate(organization1: string, organization2: string, diffResultsItems: Array<string>): string {
  let data = {
    organization1: organization1,
    organization2: organization2,
    diffResultsItems: diffResultsItems.join('<hr />')
  };

  // TODO: make this process asynchronous
  let ejsContent = fs.readFileSync('./views/pages/diff.ejs', 'utf8');

  return ejs.render(ejsContent, data);
}

export function DiffResultsItemTemplate(sectionTitle: string, diffResults: DiffResult<any>): string {
  let data = {
    sectionTitle: sectionTitle,
    diffResults: diffResults
  };

  let ejsContent = fs.readFileSync('./views/partials/diffSection.ejs', 'utf8');

  return ejs.render(ejsContent, data);
}


export class Template {
  constructor() {

  }

  public render(templateFile: string, data: any) {
    // TODO: make this process asynchronous
    let ejsContent = fs.readFileSync(templateFile, 'utf8');

    return ejs.render(ejsContent, data);
  }
}
