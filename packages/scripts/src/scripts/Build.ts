import webpack from 'webpack';
import { CreateWebpackConfig } from '../config/CreateWebpackConfig';
import { ProjectConfig } from '../config/project.config.default';
import { ServerConfig } from '../config/server.config.default';

export class Build {
	private projectConfig: ProjectConfig;
	private serverConfig: ServerConfig;
	private cwd: string;

	constructor(
		projectConfig: ProjectConfig,
		serverConfig: ServerConfig,
		cwd: string
	) {
		this.projectConfig = projectConfig;
		this.serverConfig = serverConfig;
		this.cwd = cwd;
	}

	/**
	 * Build the files.
	 */
	public build(): Promise<string> {
		return new Promise((resolve, reject) => {
			const config = new CreateWebpackConfig(
				this.projectConfig,
				this.serverConfig,
				this.cwd,
				false
			);
			const compiler = webpack(
				config.getConfig() as webpack.Configuration
			);
			compiler.run((err, stats) => {
				if (err || stats.hasErrors()) {
					reject(stats.toString({ colors: true }));
				}
				resolve(
					stats.toString({
						colors: true,
						assets: true,
						chunks: true,
					})
				);
			});
		});
	}
}
