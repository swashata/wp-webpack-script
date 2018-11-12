import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import { getProjectAndServerConfig } from '../config/getProjectAndServerConfig';
import { Callbacks, Pack } from '../scripts/Pack';
import { ProgramOptions } from './index';
import {
	endPackInfo,
	getFileCopyProgress,
	prettyPrintError,
	resolveCWD,
	watchEllipsis,
	wpackLogoSmall,
} from './utils';

/**
 * Start the `wpackio-scripts build` command.
 *
 * @param options Option as received from CLI.
 */
export function pack(options: ProgramOptions | undefined): void {
	// For spinner
	const spinText = `${wpackLogoSmall}: creating distributable zip file${watchEllipsis}`;
	const spinner = ora({
		text: spinText,
		spinner: 'dots',
		color: 'yellow',
	});
	// Get project and server config JSONs.
	const cwd = resolveCWD(options);
	const relCwd = path.relative(process.cwd(), cwd);
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
		// Start the webpack/browserSync server
		spinner.start();
		const packer = new Pack(
			projectConfig,
			{
				onMkDirPackage: p => {
					spinner.succeed(
						`created directory ${path.relative(cwd, p)}`
					);
					spinner.start(spinText);
				},
				onClean: paths => {
					let sucText = `package directory is already clean`;
					if (paths.length) {
						sucText = `deleted ${paths.length} old files`;
					}
					spinner.succeed(sucText);
					spinner.start(spinText);
				},
				onMkDirSlug: p => {
					spinner.succeed(
						`created package directory ${path.relative(cwd, p)}`
					);
					spinner.start(spinText);
				},
				onBeforeCopy: () => {
					spinner.text = getFileCopyProgress();
				},
				onCopyProgress: progress => {
					spinner.text = getFileCopyProgress(progress);
				},
				onCopy: () => {
					spinner.succeed();
					spinner.start(`creating zip archive of the package`);
				},
				onZip: result => {
					spinner.succeed(`done creating zip archive of the package`);
					endPackInfo(result);
				},
			},
			cwd
		);
	} catch (e) {
		spinner.stop();
		prettyPrintError(e, 'could not start webpack compiler.');
		process.exit(1);
	}
}
