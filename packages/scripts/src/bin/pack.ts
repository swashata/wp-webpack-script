import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';
import path from 'path';
import { getProjectConfig } from '../config/getProjectAndServerConfig';
import { Pack } from '../scripts/Pack';
import { ProgramOptions } from './index';
import {
	endPackInfo,
	getFileCopyProgress,
	getZipProgress,
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
		const { projectConfig, projectConfigPath } = getProjectConfig(
			cwd,
			options
		);
		console.log(
			`${logSymbols.success} project config: ${chalk.cyan(
				path.relative(cwd, projectConfigPath)
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
					spinner.start(`cleaning up package directory`);
				},
				onClean: paths => {
					let sucText = `package directory is already clean`;
					if (paths.length) {
						sucText = `deleted ${paths.length} old files`;
					}
					spinner.succeed(sucText);
					spinner.start(`creating installable package directory`);
				},
				onMkDirSlug: p => {
					spinner.succeed(
						`created package directory ${path.relative(cwd, p)}`
					);
					spinner.start(
						`copying files to installable package directory`
					);
				},
				onBeforeCopy: () => {
					spinner.text = getFileCopyProgress();
				},
				onCopyProgress: progress => {
					spinner.text = getFileCopyProgress(progress);
				},
				onCopy: () => {
					spinner.succeed();
				},
				onBeforeZip: () => {
					spinner.start(getZipProgress());
				},
				onZipProgress: data => {
					spinner.text = getZipProgress(data);
				},
				onZip: result => {
					spinner.succeed();
					console.log('');
					endPackInfo(result);
					console.log('');
				},
			},
			cwd
		);
		packer.pack();
	} catch (e) {
		spinner.stop();
		prettyPrintError(e, 'could not start webpack compiler.');
		process.exit(1);
	}
}
