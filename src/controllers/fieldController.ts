import * as request from 'request';
import { IncomingMessage } from 'http';
import { IFieldModel } from '../commons/interfaces/ifieldModel';
import { UrlService } from '../commons/services/urlService';

export class FieldController {

    constructor(private organization: string, private apiKey: string) {

    }

    public getFields() {
        return new Promise((resolve, reject) => {
            request(
                `${UrlService.getFieldUrl(this.organization)}`,
                { auth: { 'bearer': this.apiKey } },
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

    public updateFields(fields: IFieldModel[]) {
    }

    public createFields(fields: IFieldModel[]) {
    }

    public deleteFields(fields: IFieldModel[]) {
    }

}
