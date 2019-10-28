import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import { getProjectConfig } from '../config/getProjectAndServerConfig';
import { Build } from '../scripts/Build';
import { ProgramOptions } from './index';
import {
	endBuildInfo,
	prettyPrintError,
	resolveCWD,
	watchEllipsis,
	wpackLogoSmall,
	printErrorHeading,
	printSuccessHeading,
	printWarningHeading,
	getProgressBar,
} from './utils';

/**
 * Start the `wpackio-scripts build` command.
 *
 * @param options Option as received from CLI.
 */
export function build(options: ProgramOptions | undefined): void {
	// For spinner
	const spinner = ora({
		text: `${wpackLogoSmall}: creating production builds${watchEllipsis}`,
		spinner: 'dots',
		color: 'yellow',
		discardStdin: false,
	});
	// Set process.env.NODE_ENV to production
	process.env.NODE_ENV = 'production';
	// Set process.env.BABEL_ENV to production
	process.env.BABEL_ENV = 'production';
	// Get project and server config JSONs.
	const cwd = resolveCWD(options);
	const relCwd = path.relative(process.cwd(), cwd);
	console.log(
		`${logSymbols.success} startup: ${chalk.cyan(
			relCwd === '' ? '.' : relCwd
		)}`
	);
	try {
		const { projectConfig, projectConfigPath } = getProjectConfig(
			cwd,
			options
		);
		console.log(
			`${logSymbols.success} project config: ${chalk.cyan(
				path.relative(cwd, projectConfigPath)
			)}`
		);
		// Start the build process
		spinner.start();
		const builder: Build = new Build(projectConfig, cwd);
		builder
			.build((p, m) => {
				spinner.text = `${getProgressBar(p * 100)} ${chalk.dim(m)}`;
			})
			.then(({ status, log, warnings }) => {
				if (status === 'success') {
					spinner.succeed(`${wpackLogoSmall} build successful.`);
				} else {
					spinner.warn(`${wpackLogoSmall} built with warnings.`);
				}
				printSuccessHeading('OUTPUT');
				console.log(log);
				console.log('');
				if (status === 'warn' && Array.isArray(warnings)) {
					printWarningHeading('WARNINGS');
					warnings.forEach(w => {
						console.log(w);
						console.log('');
					});
				}
				endBuildInfo();
				console.log('');
				process.exit(0);
			})
			.catch(err => {
				spinner.fail(`${wpackLogoSmall} build failed.`);
				printErrorHeading('ERROR');
				console.error(err);
				console.log('');
				process.exit(1);
			});
	} catch (e) {
		spinner.stop();
		prettyPrintError(e, 'could not start webpack compiler.');
		process.exit(1);
	}
}
