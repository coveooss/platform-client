export interface IConfig {
    color: string;
    env: string;
    platformUrl: string;
}

class Config {
    private env: string;
    private configuration: IConfig;

    constructor() {
        this.env = process.env.NODE_ENV || 'development';
    }

    public getConfiguration(): IConfig {
        const conf = require(`./../../config/${this.env}.json`)
        return conf;
    }
}

export const config = new Config().getConfiguration();
