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
	wpackLogoSmall,
	printWatchingMessage,
	addTimeStampToLog,
	printCompilingMessage,
	printSuccessfullyCompiledMessage,
	printCompiledWithWarnMessage,
	printFailedCompileMEssage,
	printGeneralInfoMessage,
	printCompileTimeMessages,
	webpackStatToJsonOptions,
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
		`${logSymbols.success} ${chalk.bold('startup')}: ${chalk.cyan(
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
			`${logSymbols.success} ${chalk.bold(
				'project config'
			)}: ${chalk.cyan(path.relative(cwd, projectConfigPath))}`
		);
		console.log(
			`${logSymbols.success} ${chalk.bold('server config')}: ${chalk.cyan(
				path.relative(cwd, serverConfigPath)
			)}`
		);

		spinner.start();

		let lastWebpackStat: any | null = null;

		// Start the webpack/browserSync server
		const server: Server = new Server(projectConfig, serverConfig, cwd, {
			// tslint:disable:no-empty
			invalid: () => {
				printCompilingMessage();
			},
			done: () => {
				printSuccessfullyCompiledMessage();
			},
			onError: msg => {
				console.log(`${chalk.bgRed.black(' ERROR ')} please review`);
				console.log('');
				msg.errors.forEach(e => console.log(e));
				console.log('');
				printFailedCompileMEssage();
			},
			onWarn: msg => {
				printCompiledWithWarnMessage();
				msg.warnings.forEach(e => console.log(e));
			},
			onEmit: stats => {
				printCompileTimeMessages(stats, lastWebpackStat);
				lastWebpackStat = stats.toJson(webpackStatToJsonOptions);
				printWatchingMessage();
			},
			firstCompile: (stats: webpack.Stats) => {
				spinner.stop();
				const raw = stats.toJson('verbose');
				const messages = formatWebpackMessages(raw);
				console.log('');
				serverInfo(server.getServerUrl(), server.getBsUiUrl());
				console.log('');

				if (stats.hasErrors()) {
					console.log(
						`${chalk.bgRed.black(' ERROR ')} please review`
					);
					messages.errors.forEach(e => console.log(e));
					console.log('');
					printFailedCompileMEssage();
				} else if (stats.hasWarnings()) {
					printCompiledWithWarnMessage();
					messages.warnings.forEach(e => console.log(e));
				} else {
					printSuccessfullyCompiledMessage();
				}
				printCompileTimeMessages(stats, lastWebpackStat);
				printWatchingMessage();
				lastWebpackStat = stats.toJson(webpackStatToJsonOptions);
			},
			onBsChange(file) {
				printGeneralInfoMessage(`changed: ${chalk.bold(file)}`);
				printGeneralInfoMessage('reloading browser');
			},
		});
		server.serve();

		const stopServer = () => {
			console.log(
				addTimeStampToLog(
					`${logSymbols.warning} shutting down development server`
				)
			);
			server.stop();
			console.log('');
			endServeInfo();
			console.log('');
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
					printCompilingMessage();
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
