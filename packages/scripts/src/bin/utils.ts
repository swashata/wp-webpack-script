import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import figures from 'figures';
import findUp from 'find-up';
import gradient from 'gradient-string';
import path from 'path';

let isYarnCache: boolean | null = null;

export const wpackLogo = gradient.instagram.multiline(
	figlet.textSync('wpack.io', {
		font: 'Big',
		horizontalLayout: 'full',
		verticalLayout: 'full',
	})
);

export const watchSymbol = chalk.yellow(figures.circleDouble);
export const watchEllipsis = chalk.dim(figures.ellipsis);

export const bulletSymbol = chalk.magenta(figures.pointer);

export const wpackLogoSmall = gradient.instagram('wpack.io');

export const wpackLink = `${chalk.blue.underline('https://wpack.io')}`;

export const wpackIntro = `\n${boxen(wpackLogo, {
	borderStyle: 'round',
	borderColor: 'magenta',
	float: 'center',
	align: 'center',
	padding: 1,
	dimBorder: true,
})}\n`;

export function isYarn(): boolean {
	const cwd = process.cwd();
	if (isYarnCache !== null) {
		return isYarnCache;
	}
	try {
		isYarnCache = findUp.sync('yarn.lock', { cwd }) != null;

		return isYarnCache;
	} catch (_) {
		isYarnCache = false;

		return isYarnCache;
	}
}

export const contextHelp: string = `Path to context or project root directory. Defaults to current working directory. It is recommended to use absolute path, else it is calculated from current working directory. The path you mention here should be what the URL 'localhost/wp-content/<themes|plugins>/<slug>/' map to. In most cases, you should leave it, because calling the program from npm or yarn script should automatically set it.`;
export function printIntro(): void {
	console.log(wpackIntro);
}

/**
 * Resolve `cwd`, a.k.a, current working directory or context from user input.
 * It takes into account the `--context [path]` option from CLI and uses process
 * cwd, if not provided.
 *
 * @param options Options as received from CLI
 */
export function resolveCWD(
	options: { context?: string | undefined } | undefined
): string {
	let cwd = process.cwd();
	// If user has provided cwd, then use that instead
	if (options && options.context) {
		const { context } = options;
		if (path.isAbsolute(options.context)) {
			cwd = context;
		} else {
			cwd = path.resolve(cwd, context);
		}
	}

	return cwd;
}

export function serverInfo(url: string): void {
	const msg = `${wpackLogoSmall} server is running ${chalk.redBright('hot')}.
You can now view it in your browser.

    ${bulletSymbol} ${chalk.bold('Network address:')} ${chalk.blue.underline(
		url
	)}.
    ${bulletSymbol} ${chalk.bold('Stop Server:')} ${chalk.cyan(
		'Ctrl'
	)} + ${chalk.cyan('c')}.
    ${bulletSymbol} ${chalk.bold('Enqueue Assets:')} ${wpackLink}.

No files are written on disk during ${chalk.cyan('development')} mode.

To create production build, run ${chalk.cyan(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.`;
	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}

export function endServeInfo(): void {
	console.log('\n');
	const msg = `${wpackLogoSmall} server has been ${chalk.redBright(
		'stopped'
	)}.

    ${bulletSymbol} To create production build, run ${chalk.cyan(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

Thank you for using ${wpackLink}.
To spread the ${chalk.red(figures.heart)} please tweet.`;

	console.log(
		boxen(msg, {
			padding: 1,
			borderColor: 'cyan',
			align: 'left',
			float: 'left',
			borderStyle: 'round',
		})
	);
}
