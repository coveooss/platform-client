import * as request from 'request';
import { IncomingMessage } from 'http';
import { IFieldModel } from '../commons/interfaces/ifieldModel';
import { UrlService } from '../commons/services/urlService';

export class FieldController {

    constructor(private organization1: string, private apiKey1: string, private organization2: string, private apiKey2: string) {

    }

    public getFields() {
        // TODO: get for both orgs
        return new Promise((resolve, reject) => {
            request(
                `${UrlService.getFieldUrl(this.organization1)}`,
                { auth: { 'bearer': this.apiKey1 } },
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
