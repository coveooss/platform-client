import * as fs from 'fs-extra';

export class FileUtils {
    static writeFile(outputFile: string, data: any, errCallback: (err: NodeJS.ErrnoException) => void): void {
        fs.ensureDir('./exports')
            .then(() => {
                console.log('success!')
                fs.writeFile(outputFile, data, errCallback);
            })
    }

}
