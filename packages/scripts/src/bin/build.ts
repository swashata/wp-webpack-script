import { Build } from '../scripts/Build';
import { getProjectAndServerConfig } from './getProjectAndServerConfig';
import { ProgramOptions } from './index';
import { resolveCWD } from './utils';

/**
 * Start the `wpackio-scripts build` command.
 *
 * @param options Option as received from CLI.
 */
export function build(options: ProgramOptions | undefined): void {
	console.log('Creating production builds...');
	// Set process.env.NODE_ENV to production
	process.env.NODE_ENV = 'production';
	// Set process.env.BABEL_ENV to production
	process.env.BABEL_ENV = 'production';
	// Get project and server config JSONs.
	const cwd = resolveCWD(options);
	console.log(`Using startup path: ${cwd}`);
	try {
		const {
			projectConfig,
			serverConfig,
			projectConfigPath,
			serverConfigPath,
		} = getProjectAndServerConfig(cwd, options);
		console.log(`Using project config from ${projectConfigPath}`);
		console.log(`Using server config from ${serverConfigPath}`);
		// Start the webpack/browserSync server
		const builder: Build = new Build(projectConfig, serverConfig, cwd);
		builder
			.build()
			.then(log => {
				console.log('Build Successful. Please check the log below');
				console.log(log);
				process.exit(0);
			})
			.catch(err => {
				console.error(
					'Could not create production build. Please check the log below'
				);
				console.log(err);
				process.exit(1);
			});
	} catch (e) {
		console.error(
			'Could not start development server. Please check the log below.'
		);
		console.error(e);
		process.exit(1);
	}
}
