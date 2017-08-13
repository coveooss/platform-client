import * as request from 'request';
import { IncomingMessage } from 'http';
import { IFieldModel } from '../commons/interfaces/ifieldModel';
import { UrlService } from '../commons/services/urlService';
import { IOrganizationIdentifier } from '../commons/interfaces/iorganization';

export class FieldController {

    constructor(private organization1: IOrganizationIdentifier, private organization2: IOrganizationIdentifier) {

    }

    public getFields(organization: IOrganizationIdentifier) {
        console.log('getting fields ...');

        // TODO: get for both orgs
        return new Promise((resolve, reject) => {
            return request(
                `${UrlService.getFieldUrl(organization.id, { page: '2', numberOfResults: '100' })}`,
                { auth: { 'bearer': organization.apiKey } },
                (err: any, response: request.RequestResponse, body: IFieldModel[]) => {
                    if (err) {
                        console.log('err');
                        Promise.reject(err);
                    } else {
                        console.log(response.statusCode) // 200
                        console.log(response.headers['content-type']) // 'image/png'
                        Promise.resolve()
                    }
                })
        })
    }

    public updateFields() {
    }

    public createFields() {
    }

    public deleteFields() {
    }

    public diff(callback) {
        console.log('Calling diff');
        Promise.all([this.getFields(this.organization1), this.getFields(this.organization2)])
            .then(values => {
                callback(values)
            })
            .catch((err) => {
                console.log('**Error***');
                console.log(err);
                console.log('*********************');

            })
    }

}
