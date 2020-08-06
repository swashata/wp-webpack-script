import webpack from 'webpack';

import { formatWebpackMessages } from '../dev-utils';
import { CreateWebpackConfig } from '../config/CreateWebpackConfig';
import { ProjectConfig } from '../config/project.config.default';
import { serverConfigDefault } from '../config/server.config.default';

/**
 * Create production ready files.
 */
export class Build {
	private projectConfig: ProjectConfig;

	private cwd: string;

	constructor(projectConfig: ProjectConfig, cwd: string) {
		this.projectConfig = projectConfig;
		this.cwd = cwd;
	}

	/**
	 * Build the files.
	 */
	public build(
		progress: (p: number, m: string) => void
	): Promise<{
		status: 'error' | 'warn' | 'success';
		log: string;
		warnings?: string[];
	}> {
		return new Promise((resolve, reject) => {
			const config = new CreateWebpackConfig(
				this.projectConfig,
				serverConfigDefault,
				this.cwd,
				false
			);
			const webpackConfig = config.getWebpackConfig() as webpack.Configuration;
			const compiler = webpack(webpackConfig);
			new webpack.ProgressPlugin((percentage, msg) => {
				progress(percentage, msg);
			}).apply(compiler);
			try {
				compiler.run((err, stats) => {
					const raw = stats.toJson('verbose');
					const messages = formatWebpackMessages(raw);
					const outputLog = stats.toString({
						colors: true,
						assets: true,
						chunks: false,
						entrypoints: false,
						hash: false,
						version: false,
						modules: false,
						builtAt: false,
						timings: false,
						warnings: false,
						errors: false,
					});

					if (!messages.errors.length && !messages.warnings.length) {
						// All good
						resolve({
							status: 'success',
							log: outputLog,
						});
					}
					if (messages.errors.length) {
						reject(messages.errors.join('\n\n'));
					}
					resolve({
						status: 'warn',
						log: outputLog,
						warnings: messages.warnings,
					});
				});
			} catch (e) {
				console.log(e);
				console.log(JSON.stringify(e, null, 2));
				reject(e);
			}
		});
	}
}
