import { Logger } from '../commons/logger';
export interface IConfig {
	workingDirectory: string;
	color: string;
	env: string;
	coveo: {
		platformUrl: string
	};
}

class Config {
	private env: string;
	private configuration: IConfig;

	constructor() {
		this.env = process.env.NODE_ENV || 'development';
	}

	public getConfiguration(): IConfig  {
		try {
			return require(`./../environments/${this.env}.js`)
		} catch (error) {
			Logger.error('Unable to load environment', error)
			throw new Error('Invalid environment');
		}
	}
}

export const config = new Config().getConfiguration();
