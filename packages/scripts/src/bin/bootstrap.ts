import chalk from 'chalk';
import execa from 'execa';
import logSymbols from 'log-symbols';
import path from 'path';
import PrettyError from 'pretty-error';

import { ProgramOptions } from '.';
import { Bootstrap } from '../scripts/Bootstrap';
import { bulletSymbol, endBootstrapInfo, isYarn, resolveCWD } from './utils';

export async function bootstrap(
	options: ProgramOptions | undefined,
	version: string
): Promise<void> {
	// For error handling
	const pe = new PrettyError();
	const cwd = resolveCWD(options);
	const relCwd = path.relative(process.cwd(), cwd);
	console.log(
		`${logSymbols.success} startup: ${chalk.cyan(
			relCwd === '' ? '.' : relCwd
		)}`
	);
	try {
		const initiator = new Bootstrap(cwd, version);

		try {
			const done = await initiator.bootstrap();

			if (done.configured === 'project') {
				console.log(
					`${logSymbols.success} project bootstrap complete!`
				);
			} else {
				console.log(
					`${logSymbols.success} server configuration complete!`
				);
			}

			// Install all dependencies from `done` if any
			const command = isYarn() ? 'yarn' : 'npm';
			const add = isYarn() ? 'add' : 'i';
			const devParam = isYarn() ? '--dev' : '-D';

			if (done.deps && done.deps.dependencies.length) {
				console.log(`🗳️ installing project dependencies\n`);
				console.log(
					`    ${bulletSymbol} ${chalk.green(
						done.deps.dependencies.join(', ')
					)}`
				);
				console.log(`⏲️ this may take a while!\n`);
				const dep = execa(command, [add, ...done.deps.dependencies]);
				dep.stdout.pipe(process.stdout);
				await dep;
				console.log(
					`${logSymbols.success} done installing project dependencies`
				);
			}
			if (done.deps && done.deps.devDependencies.length) {
				console.log(`🗳️ installing project dev dependencies\n`);
				console.log(
					`    ${bulletSymbol} ${chalk.green(
						done.deps.devDependencies.join(', ')
					)}`
				);
				console.log(`⏲️ this may take a while!\n`);
				const dep = execa(command, [
					add,
					...done.deps.devDependencies,
					devParam,
				]);
				dep.stdout.pipe(process.stdout);
				await dep;
				console.log(
					`${
						logSymbols.success
					} done installing project dev dependencies`
				);
			}
		} catch (e) {
			console.log(
				`${logSymbols.error} configuration files are already present.`
			);
		}

		// Log how to access and start, develop, build etc.
		endBootstrapInfo();
	} catch (e) {
		console.log(pe.render(e));
	}
}
