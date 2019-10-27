import chalk from 'chalk';
import execa from 'execa';
import logSymbols from 'log-symbols';
import ora from 'ora';
import PrettyError from 'pretty-error';

import { ProgramOptions } from '.';
import { Bootstrap } from '../scripts/Bootstrap';
import {
	bulletSymbol,
	endBootstrapInfo,
	isYarn,
	resolveCWD,
	watchEllipsis,
	wpackLogoSmall,
} from './utils';

export async function bootstrap(
	options: ProgramOptions | undefined,
	version: string
): Promise<void> {
	// For error handling
	const pe = new PrettyError();
	const cwd = resolveCWD(options);
	console.log(`📦 bootstraping ${wpackLogoSmall} into your project`);
	try {
		const initiator = new Bootstrap(cwd, version);

		try {
			const done = await initiator.bootstrap();

			if (done.configured === 'project') {
				console.log(
					`${logSymbols.success} ${wpackLogoSmall} bootstrap complete!`
				);
				console.log(
					`${
						logSymbols.success
					} project config created at ${chalk.yellow(
						'./wpackio.project.js'
					)}`
				);
			} else {
				console.log(
					`${logSymbols.success} server configuration complete!`
				);
			}

			console.log(
				`${logSymbols.success} server config created at ${chalk.yellow(
					'./wpackio.server.js'
				)}`
			);

			// Install all dependencies from `done` if any
			const command = isYarn() ? 'yarn' : 'npm';
			const add = isYarn() ? 'add' : 'i';
			const devParam = isYarn() ? '--dev' : '-D';
			const spinner = ora({ spinner: 'dots3', discardStdin: false });

			if (done.deps && done.deps.dependencies.length) {
				console.log(
					`${
						logSymbols.info
					} need to install following ${chalk.yellow(
						'dependencies'
					)}\n`
				);
				console.log(
					`    ${bulletSymbol} ${chalk.yellow(
						done.deps.dependencies.join(', ')
					)}\n`
				);
				spinner.start(
					`installing dependencies${watchEllipsis} may take a while`
				);

				try {
					await execa(command, [add, ...done.deps.dependencies]);
					spinner.succeed('done installing dependencies\n');
				} catch (e) {
					spinner.fail('could not install all dependencies');
					console.log(pe.render(e));
				}
			}
			if (done.deps && done.deps.devDependencies.length) {
				console.log(
					`${
						logSymbols.info
					} need to install following ${chalk.yellow(
						'dev dependencies'
					)}\n`
				);
				console.log(
					`    ${bulletSymbol} ${chalk.green(
						done.deps.devDependencies.join(', ')
					)}\n`
				);
				spinner.start(
					`installing dev dependencies${watchEllipsis} may take a while`
				);

				try {
					await execa(command, [
						add,
						...done.deps.devDependencies,
						devParam,
					]);
					spinner.succeed('done installing devDependencies\n');
				} catch (e) {
					spinner.fail('could not install all devDependencies');
					console.log(pe.render(e));
				}
			}
		} catch (e) {
			console.log(
				`${logSymbols.error} configuration files are already present.`
			);
			console.log(
				`${logSymbols.info} change the file code if you wish to modify the tooling.`
			);
		}

		// Log how to access and start, develop, build etc.
		console.log('');
		endBootstrapInfo();
		console.log('');
	} catch (e) {
		console.log(pe.render(e));
	}
}
