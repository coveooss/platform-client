import * as request from 'request';
import { IncomingMessage } from 'http';
import { IFieldModel } from '../commons/interfaces/ifieldModel';
import { UrlService } from '../commons/services/urlService';
import { IOrganizationIdentifier } from '../commons/interfaces/iorganization';

export class FieldController {

    constructor(private organization1: IOrganizationIdentifier, private organization2: IOrganizationIdentifier) {

    }

    public getFields() {
        // TODO: get for both orgs
        return new Promise((resolve, reject) => {
            request(
                `${UrlService.getFieldUrl(this.organization1.id)}`,
                { auth: { 'bearer': this.organization1.apiKey } },
                (err: any, response: request.RequestResponse, body: IFieldModel[]) => {
                    if (err) {
                        process.stderr.write(err);
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

    public diff() {

        return {
            'organizationId': '',
            'IdenticalParam': 'It is the same',
            'Different param': 'It\'s not the same',
        };

    }

}
