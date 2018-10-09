import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import PrettyError from 'pretty-error';
import clearConsole from 'react-dev-utils/clearConsole';
import { Server } from '../scripts/Server';
import { getProjectAndServerConfig } from './getProjectAndServerConfig';
import { ProgramOptions } from './index';
import {
	endServeInfo,
	resolveCWD,
	serverInfo,
	watchEllipsis,
	watchSymbol,
	wpackLogoSmall,
} from './utils';

/**
 * Start the `wpackio-scripts serve` command.
 *
 * @param options Options as received from CLI.
 */
export function serve(options: ProgramOptions | undefined): void {
	// Set process.env.NODE_ENV to development
	process.env.NODE_ENV = 'development';
	// Set process.env.BABEL_ENV to development
	process.env.BABEL_ENV = 'development';
	// Get project and server config JSONs.
	const cwd = resolveCWD(options);
	const relCwd = path.relative(process.cwd(), cwd);
	// For pretty logging
	const pe = new PrettyError();

	// For spinner
	const spinner = ora({
		text: `initiating ${wpackLogoSmall} development server`,
		spinner: 'dots',
		color: 'yellow',
	});

	console.log(
		`${logSymbols.success} startup: ${chalk.cyan(
			relCwd === '' ? '.' : relCwd
		)}`
	);
	try {
		const {
			projectConfig,
			serverConfig,
			projectConfigPath,
			serverConfigPath,
		} = getProjectAndServerConfig(cwd, options);
		console.log(
			`${logSymbols.success} project config: ${chalk.cyan(
				path.relative(cwd, projectConfigPath)
			)}`
		);
		console.log(
			`${logSymbols.success} server config: ${chalk.cyan(
				path.relative(cwd, serverConfigPath)
			)}`
		);

		spinner.start();

		// Start the webpack/browserSync server
		const server: Server = new Server(projectConfig, serverConfig, cwd, {
			// tslint:disable:no-empty
			invalid: () => {
				spinner.stop();
				clearConsole();
				serverInfo(server.getServerUrl());
				// Show message that we are compiling
				spinner.start(`compiling changes${watchEllipsis}`);
			},
			done: stats => {
				spinner.stop();
				clearConsole();
				serverInfo(server.getServerUrl());
				// Show message that we have compiled
				spinner.start('compiling...');
				spinner.stopAndPersist({
					symbol: logSymbols.success,
					text: 'compiled successfully',
				});
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			onError: msg => {
				spinner.stop();
				clearConsole();
				console.error(`${logSymbols.error} Failed to compile.\n`);
				msg.errors.forEach(e => console.log(e));
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			onWarn: msg => {
				spinner.stop();
				clearConsole();
				console.log(`${logSymbols.warning} Compiled with warnings..\n`);
				msg.warnings.forEach(e => console.log(e));
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			firstCompile: () => {
				spinner.stop();
				clearConsole();
				serverInfo(server.getServerUrl());
				console.log(
					`${logSymbols.success} ${chalk.dim('server started')}`
				);
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
		});
		server.serve();
		// Listen for SIGINT and quit properly
		process.on('SIGINT', () => {
			spinner.stop();
			console.log('');
			console.log(`${logSymbols.error} shutting down development server`);
			server.stop();
			endServeInfo();
			process.exit(0);
		});
	} catch (e) {
		spinner.stop();
		console.log(`${logSymbols.error} could not start server.`);
		console.log(pe.render(e));
		process.exit(1);
	}
}
