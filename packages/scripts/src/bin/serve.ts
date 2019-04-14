import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import clearConsole from 'react-dev-utils/clearConsole';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';
import webpack from 'webpack';
import { getProjectAndServerConfig } from '../config/getProjectAndServerConfig';
import { Server } from '../scripts/Server';
import { ProgramOptions } from './index';
import {
	endServeInfo,
	prettyPrintError,
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
				serverInfo(server.getServerUrl(), server.getBsUiUrl());
				// Show message that we are compiling
				spinner.start(`compiling changes${watchEllipsis}`);
			},
			done: () => {
				spinner.stop();
				clearConsole();
				serverInfo(server.getServerUrl(), server.getBsUiUrl());
				// Show message that we have compiled
				spinner.start('compiling...');
				spinner.stopAndPersist({
					symbol: logSymbols.success,
					text: chalk.dim('compiled successfully'),
				});
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			onError: msg => {
				spinner.stop();
				clearConsole();
				console.log(`${chalk.bgRed.black(' ERROR ')} please review`);
				console.log('');
				msg.errors.forEach(e => console.log(e));
				console.log('');
				console.error(
					`${logSymbols.error} ${chalk.dim('failed to compile')}\n`
				);
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			onWarn: msg => {
				spinner.stop();
				clearConsole();
				console.log(
					`${logSymbols.warning} ${chalk.dim(
						'compiled with warnings...'
					)}\n`
				);
				msg.warnings.forEach(e => console.log(e));
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
			firstCompile: (stats: webpack.Stats) => {
				spinner.stop();
				const raw = stats.toJson('verbose');
				const messages = formatWebpackMessages(raw);
				clearConsole();
				serverInfo(server.getServerUrl(), server.getBsUiUrl());
				console.log(
					`${logSymbols.success} ${chalk.dim('server started!')}`
				);
				if (stats.hasErrors()) {
					console.log(
						`${chalk.bgRed.black(' ERROR ')} please review`
					);
					messages.errors.forEach(e => console.log(e));
					console.log('');
					console.error(
						`${logSymbols.error} ${chalk.dim(
							'failed to compile'
						)}\n`
					);
				} else if (stats.hasWarnings()) {
					console.log(
						`${logSymbols.warning} ${chalk.dim(
							'compiled with warnings...'
						)}\n`
					);
					messages.warnings.forEach(e => console.log(e));
				} else {
					console.log(
						`${logSymbols.success} ${chalk.dim(
							'compiled successfully'
						)}\n`
					);
				}
				console.log(
					`${watchSymbol} watching for changes${watchEllipsis}`
				);
			},
		});
		server.serve();

		const stopServer = () => {
			spinner.stop();
			console.log('');
			console.log(`${logSymbols.error} shutting down development server`);
			server.stop();
			endServeInfo();
			process.exit(0);
		};

		// Listen for `r`
		if (process.stdin.setRawMode) {
			process.stdin.setRawMode(true);
			const { stdin } = process;
			stdin.setEncoding('utf8');
			stdin.on('data', (key: string) => {
				// ctrl-c ( end of text )
				// or if pressing q, then stop
				// then stop server
				if (key === '\u0003' || key === 'q') {
					stopServer();
				}

				// If pressing r, then just refresh
				if (key.indexOf('r') === 0) {
					server.refresh();
				}
			});
		} else {
			// Listen for SIGINT and quit properly
			process.on('SIGINT', () => {
				stopServer();
			});
		}
	} catch (e) {
		spinner.stop();
		prettyPrintError(e, 'could not start server.');
		process.exit(1);
	}
}
