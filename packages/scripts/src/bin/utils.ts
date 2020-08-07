import archiver from 'archiver';
import chalk from 'chalk';
import { ProgressData } from 'cpy';
import figures from 'figures';
import findUp from 'find-up';
import gradient from 'gradient-string';
import logSymbols from 'log-symbols';
import path from 'path';
import PrettyError from 'pretty-error';
import webpack from 'webpack';
import { WpackioError } from '../errors/WpackioError';
import { ArchiveResolve } from '../scripts/Pack';

const pkgPath = path.resolve(__dirname, '../../package.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require(pkgPath);

export const bulletSymbol = chalk.magenta(figures.pointer);

export const donationLink = `
    ${bulletSymbol} PATREON: ${chalk.bold.blue.underline(
	'https://www.patreon.com/swashata'
)}
    ${bulletSymbol} OPENCOLLECTIVE: ${chalk.bold.blue.underline(
	'https://opencollective.com/wpackio'
)}
`;

let isYarnCache: boolean | null = null;

export const wpackLogo = `${chalk.bold(gradient.instagram(`__      __`))}
${chalk.bold(gradient.instagram(`\\ \\ /\\ / /`))} ${chalk.bold(
	gradient.instagram('PACK.IO')
)}
${chalk.bold(gradient.instagram(` \\ V  V /`))}  ${chalk.bold.yellowBright(
	'JavaScript'
)} tooling for ${chalk.bold.blueBright('WordPress')}
${chalk.bold(gradient.instagram(`  \\_/\\_/`))}   ${chalk.magenta(
	'v'
)}${chalk.bold.magenta(`${pkg.version}`)}`;

export const wpackLogoSmall = gradient.instagram('wpack.io');

export const donationSentence = `If ${wpackLogoSmall} is worthy, 🙏 consider donating.
${donationLink}
Every amount counts.`;

export function addTimeStampToLog(log: string): string {
	const time = new Date().toTimeString().split(' ')[0];
	return `${chalk.dim(`｢${wpackLogoSmall} ${time}｣`)} ${log}`;
}

export const watchSymbol = `${logSymbols.info}`;
export const watchEllipsis = chalk.dim(figures.ellipsis);

export function printWatchingMessage() {
	console.log(
		addTimeStampToLog(`${watchSymbol} watching for changes${watchEllipsis}`)
	);
}

export function printCompilingMessage() {
	console.log(
		addTimeStampToLog(
			`${logSymbols.info} compiling changes${watchEllipsis}`
		)
	);
}

export function printCompileTimeMessage(stat: any, lastStat: any | null) {
	// safety
	if (!stat || typeof stat !== 'object' || !stat.builtAt) {
		return;
	}

	if (
		lastStat === null ||
		typeof lastStat !== 'object' ||
		!lastStat.builtAt ||
		stat.builtAt !== lastStat.builtAt
	) {
		// get bundle name
		let name = '';
		if (stat.name) {
			const entryName = stat.name;
			name = chalk.green(entryName);
			if (stat.errors.length) {
				name = chalk.red(entryName);
			} else if (stat.warnings.length) {
				name = chalk.yellow(entryName);
			}
			name = `[${name}] `;
		}

		// get log symbol
		let symbol = logSymbols.success;
		if (stat.errors.length) {
			symbol = logSymbols.error;
		} else if (stat.warnings.length) {
			symbol = logSymbols.warning;
		}

		// get log message
		let msg = 'was rebuilt in';
		if (lastStat === null) {
			msg = 'was built in';
		}

		console.log(
			addTimeStampToLog(
				`${symbol} ${name}bundle ${msg} ${chalk.magenta(
					`${stat.time}ms`
				)}.`
			)
		);
	}
}

export const webpackStatToJsonOptions: webpack.Stats.ToJsonOptions = {
	timings: true,
	assets: false,
	builtAt: true,
	cached: false,
	cachedAssets: false,
	children: true,
	chunkModules: false,
	chunkOrigins: false,
	chunks: false,
	entrypoints: false,
	env: false,
	errors: true,
	warnings: true,
	modules: false,
	publicPath: false,
	depth: false,
};

export function printCompileTimeMessages(
	stats: webpack.Stats,
	lastStatsJson: any | null
) {
	let statsJson: any | null = null;
	if (stats) {
		statsJson = stats.toJson(webpackStatToJsonOptions);
	}

	if (
		statsJson !== null &&
		!statsJson.time &&
		statsJson.children &&
		Array.isArray(statsJson.children)
	) {
		// if it is multicompiler
		statsJson.children.forEach((sj: any, index: number) => {
			if (lastStatsJson === null) {
				printCompileTimeMessage(sj, null);
			} else if (
				lastStatsJson !== null &&
				lastStatsJson.children &&
				Array.isArray(lastStatsJson.children)
			) {
				printCompileTimeMessage(sj, lastStatsJson.children[index]);
			}
		});
	} else if (statsJson.time) {
		// if it is single compiler
		if (lastStatsJson === null) {
			printCompileTimeMessage(statsJson, null);
		} else {
			printCompileTimeMessage(statsJson, lastStatsJson);
		}
	}
}

export function printSuccessfullyCompiledMessage() {
	console.log(
		addTimeStampToLog(`${logSymbols.success} compiled successfully`)
	);
}

export function printCompiledWithWarnMessage() {
	console.log(
		addTimeStampToLog(
			`${logSymbols.warning} ${chalk.dim('compiled with warnings...')}`
		)
	);
}

export function printFailedCompileMEssage() {
	console.error(
		addTimeStampToLog(
			`${logSymbols.error} ${chalk.dim('failed to compile')}`
		)
	);
}

export function printGeneralInfoMessage(msg: string, symbol?: string) {
	if (typeof symbol === 'undefined') {
		// eslint-disable-next-line no-param-reassign
		symbol = logSymbols.info;
	}
	console.info(addTimeStampToLog(`${symbol} ${msg}`));
}

export function printErrorHeading(msg: string = 'ERROR'): void {
	console.log('');
	console.log(`${chalk.bgRed.black(` ${msg} `)} please review`);
	console.log('');
}

export function printWarningHeading(msg: string = 'WARNING'): void {
	console.log('');
	console.log(`${chalk.bgYellow.black(` ${msg} `)} please review`);
	console.log('');
}

export function printSuccessHeading(msg: string = 'OUTPUT'): void {
	console.log('');
	console.log(
		`${chalk.bgGreenBright(chalk.bold.hex('#000000')(` ${msg} `))}`
	);
	console.log('');
}

export const wpackLink = `${chalk.blue.underline('https://wpack.io')}`;

export const wpackIntro = `${wpackLogo}\n`;

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

export function serverInfo(url: string, uiUrl: string | boolean): void {
	const msg = `${logSymbols.success} ${wpackLogoSmall} server is running at.

    ${bulletSymbol} ${chalk.blue.underline(url)}

and BrowserSync UI running at

    ${bulletSymbol} ${
		typeof uiUrl === 'string'
			? chalk.blue.underline(uiUrl)
			: chalk.red('N/A')
	}

Press ${chalk.yellow('r')} to recompile and ${chalk.yellow('q')} to force quit.
To create production build, run

    ${bulletSymbol} ${chalk.yellow(isYarn() ? 'yarn build' : 'npm run build')}

${chalk.dim('No files are written on disk during development mode.')}`;

	console.log(msg);
}

export function serveEntryInfo() {
	const msg = `${
		logSymbols.info
	} you can also start selective entries by running

    ${bulletSymbol} ${chalk.yellow(
		isYarn() ? 'yarn start -e 0 1' : 'npm run start -e 0 1'
	)}
`;
	console.log(msg);
}

export function endServeInfo(): void {
	const msg = `${
		logSymbols.success
	} ${wpackLogoSmall} server has been ${chalk.redBright('stopped')}.
To create production build, run

    ${bulletSymbol} ${chalk.yellow(isYarn() ? 'yarn build' : 'npm run build')}.

Thank you for using ${wpackLink}.
To spread the ${chalk.red(figures.heart)} please ${chalk.yellowBright(
		figures.star
	)} our repo and tweet.

${donationSentence}`;

	console.log(msg);
}

export function endBuildInfo(): void {
	const msg = `${wpackLogoSmall} production build was ${chalk.green(
		'successful'
	)}.

All files were written to disk and you can visit your local server.

If your filesize is too large, remember you can use advanced
dynamic import and multiple entry-points easily with ${wpackLogoSmall}.

    ${bulletSymbol} For more info, visit: ${wpackLink}.

To spread the ${chalk.red(figures.heart)} please ${chalk.yellowBright(
		figures.star
	)} our repo and tweet.

${donationSentence}`;

	console.log(msg);
}

export function endBootstrapInfo(): void {
	const msg = `${wpackLogoSmall} was ${chalk.green(
		'successfully'
	)} integrated within your project.

If this is your first run edit your ${chalk.bold.magenta(
		'wpackio.project.js'
	)} file and put
entrypoints. You will find examples within the file itself.

You should keep ${chalk.bold.yellow(
		'wpackio.server.js'
	)} outside your VCS tracking
as it will most likely differ for different users.

You can run ${chalk.dim('bootstrap')} command again and it will create the
${chalk.bold.yellow('wpackio.server.js')} file if not present.

    ${bulletSymbol} Start Development: ${chalk.yellow(
		isYarn() ? 'yarn start' : 'npm start'
	)}.
    ${bulletSymbol} Production Build: ${chalk.yellow(
		isYarn() ? 'yarn build' : 'npm run build'
	)}.
    ${bulletSymbol} Create local server config: ${chalk.yellow(
		isYarn() ? 'yarn bootstrap' : 'npm run bootstrap'
	)}.
    ${bulletSymbol} Create distributable zip: ${chalk.yellow(
		isYarn() ? 'yarn archive' : 'npm run archive'
	)}.
    ${bulletSymbol} For more info, visit: ${wpackLink}.

To enqueue the assets within your plugin or theme, make sure you
have ${chalk.yellow('wpackio/enqueue')} package from packagist.org/composer
and follow the intructions from documentation. To install now, run

    ${bulletSymbol} ${chalk.yellow('composer require wpackio/enqueue')}.

To spread the ${chalk.red(figures.heart)} please ${chalk.yellowBright(
		figures.star
	)} our repo and tweet.`;

	console.log(msg);
}

export function prettyPrintError(
	e: Error | WpackioError,
	errorMsg: string
): void {
	const errorPrefix = `  ${chalk.dim.red(figures.pointer)}  `;
	console.log(chalk.dim('='.repeat(errorMsg.length + 2)));
	console.log(`${logSymbols.error} ${errorMsg}`);
	console.log(chalk.dim('='.repeat(errorMsg.length + 2)));
	console.log('');
	if (e instanceof WpackioError) {
		console.log(chalk.bgRed.black(' please review the following errors '));
		console.log('');
		console.error(
			errorPrefix +
				e.message
					.split('\n')
					.reduce((acc, line) => `${acc}\n${errorPrefix}${line}`)
		);
	} else {
		const pe = new PrettyError();
		console.error(pe.render(e));
	}
	console.log('\n\n\n');
}

export function getProgressBar(done: number): string {
	if (Number.isNaN(done) || done === Infinity || done === -Infinity) {
		// eslint-disable-next-line no-param-reassign
		done = 0;
	}
	const pbDoneLength = Math.floor((done / 100) * 20);

	let gFunc = gradient('red', 'red');
	if (pbDoneLength >= 5) {
		gFunc = gradient('red', 'red', 'yellow');
	}
	if (pbDoneLength >= 10) {
		gFunc = gradient('red', 'red', 'yellow', 'yellow');
	}
	if (pbDoneLength >= 15) {
		gFunc = gradient('red', 'red', 'yellow', 'yellow', 'green');
	}

	const pbDone = gFunc('='.repeat(pbDoneLength));
	const pbDoing = chalk.gray('-'.repeat(20 - pbDoneLength));
	return `[${pbDone}${pbDoing}] ${chalk.yellow(done.toFixed(2))}%`;
}

export function getFileCopyProgress(progress?: ProgressData): string {
	let done = 0;
	let totalFiles = 0;
	let filesDone = 0;
	let size = 0;
	if (progress) {
		done = Math.round(
			(progress.completedFiles / progress.totalFiles) * 100
		);
		// eslint-disable-next-line prefer-destructuring
		totalFiles = progress.totalFiles;
		filesDone = progress.completedFiles;
		size = progress.completedSize;
	}

	return `copying files ${getProgressBar(done)} ${chalk.magenta(
		filesDone.toString()
	)}${chalk.dim('/')}${chalk.cyan(totalFiles.toString())} Files ${chalk.blue(
		(size / 1024).toFixed(2)
	)} KB`;
}

export function getZipProgress(data?: archiver.ProgressData): string {
	let entriesTotal = 0;
	let entriesProcessed = 0;
	let bytesTotal = 0;
	let bytesProcessed = 0;
	if (data) {
		entriesTotal = data.entries.total;
		entriesProcessed = data.entries.processed;
		bytesTotal = data.fs.totalBytes;
		bytesProcessed = data.fs.processedBytes;
	}
	const done = Math.round((entriesProcessed / entriesTotal) * 100);
	return `creating zip ${getProgressBar(done)} ${chalk.magenta(
		entriesProcessed.toString()
	)}${chalk.dim('/')}${chalk.cyan(
		entriesTotal.toString()
	)} Files ${chalk.blue((bytesProcessed / 1024).toFixed(2))}${chalk.dim(
		'/'
	)}${chalk.cyan((bytesTotal / 1024).toFixed(2))} KB`;
}

export function endPackInfo(results: ArchiveResolve): void {
	const msg = `${chalk.bgGreenBright(chalk.bold.hex('#000000')(' OUTPUT '))}

    ${bulletSymbol} Zip Location: ${chalk.blue(results.relPath)}.
    ${bulletSymbol} File Size: ${chalk.blue(
		(results.size / 1024).toFixed(2)
	)} KB.

${wpackLogoSmall} package and archive was ${chalk.green('successful')}.

Thank you for using ${wpackLink}.
To spread the ${chalk.red(figures.heart)} please ${chalk.yellowBright(
		figures.star
	)} our repo and tweet.

${donationSentence}`;

	console.log(msg);
}
