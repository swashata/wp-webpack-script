import fs from 'fs';
import path from 'path';
import lockfile from 'lockfile';
import util from 'util';
import os from 'os';
import crypto from 'crypto';

const lfUnlock = util.promisify(lockfile.unlock);

/**
 * Check if file exists or not using fs API.
 */
export function fileExists(filepath: string): boolean {
	try {
		// tslint:disable-next-line:non-literal-fs-path
		return fs.statSync(filepath).isFile();
	} catch (_) {
		return false;
	}
}

/**
 * Check whether current working directory is a typescript project.
 *
 *
 * @param cwd Current working directory.
 * @returns True if tsconfig is found, false otherwiise.
 */
export function hasTypeScript(cwd: string): [boolean, string] {
	const tsconfigPath = path.resolve(cwd, './tsconfig.json');
	return [fileExists(tsconfigPath), tsconfigPath];
}

export const WORDPRESS_NAMESPACE = '@wordpress/';
export const BUNDLED_PACKAGES = ['@wordpress/icons', '@wordpress/interface'];

/**
 * Given a string, returns a new string with dash separators converted to
 * camelCase equivalent. This is not as aggressive as `_.camelCase` in
 * converting to uppercase, where Lodash will also capitalize letters
 * following numbers.
 *
 * @see {https://github.com/WordPress/gutenberg/blob/c047e2716149c794eebff3c2c002f66a6f546f59/packages/dependency-extraction-webpack-plugin/lib/util.js#L83}
 *
 * @param {string} input Input dash-delimited string.
 * @return {string} Camel-cased string.
 */
function camelCaseDash(input: string): string {
	return input.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Wpackio specific request to global transformation. This is used in
 * @wordpress/dependency-extraction-webpack-plugin.
 *
 * Unlike the default one, it doesn't transform react/reactdom, moment, jQuery
 * etc.
 *
 * Transform @wordpress dependencies:
 * - request `@wordpress/api-fetch` becomes `[ 'wp', 'apiFetch' ]`
 * - request `@wordpress/i18n` becomes `[ 'wp', 'i18n' ]`
 *
 * @param request Module request (the module name in `import from`) to be transformed
 * @returns The resulting external definition. Return `undefined`
 *   to ignore the request. Return `string|string[]` to map the request to an external.
 */
export function wpackioRequestsToExternals(
	request: string
): string | string[] | undefined {
	if (BUNDLED_PACKAGES.includes(request)) {
		return undefined;
	}

	if (request.startsWith(WORDPRESS_NAMESPACE)) {
		return ['wp', camelCaseDash(request.substring(WORDPRESS_NAMESPACE.length))];
	}

	return undefined;
}

/**
 * Default request to global transformation
 *
 * Transform @wordpress dependencies:
 * - request `@wordpress/api-fetch` becomes `[ 'wp', 'apiFetch' ]`
 * - request `@wordpress/i18n` becomes `[ 'wp', 'i18n' ]`
 *
 * @param {string} request Module request (the module name in `import from`) to be transformed
 * @return {string|string[]|undefined} The resulting external definition. Return `undefined`
 *   to ignore the request. Return `string|string[]` to map the request to an external.
 */
export function defaultRequestToExternal(
	request: string
): string | string[] | undefined {
	switch (request) {
		case 'moment':
			return request;

		case '@babel/runtime/regenerator':
			return 'regeneratorRuntime';

		case 'lodash':
		case 'lodash-es':
			return 'lodash';

		case 'jquery':
			return 'jQuery';

		case 'react':
			return 'React';

		case 'react-dom':
			return 'ReactDOM';

		default:
			return wpackioRequestsToExternals(request);
	}
}

/**
 * Wpackio specific request to WordPress script handle transformation
 *
 * Transform @wordpress dependencies:
 * - request `@wordpress/i18n` becomes `wp-i18n`
 * - request `@wordpress/escape-html` becomes `wp-escape-html`
 *
 * @param {string} request Module request (the module name in `import from`) to be transformed
 * @return {string|undefined} WordPress script handle to map the request to. Return `undefined`
 *   to use the same name as the module.
 */
export function wpackioRequestToHandle(request: string): string | undefined {
	if (request.startsWith(WORDPRESS_NAMESPACE)) {
		return `wp-${request.substring(WORDPRESS_NAMESPACE.length)}`;
	}
	return undefined;
}

/**
 * Default request to WordPress script handle transformation
 *
 * Transform @wordpress dependencies:
 * - request `@wordpress/i18n` becomes `wp-i18n`
 * - request `@wordpress/escape-html` becomes `wp-escape-html`
 *
 * @param {string} request Module request (the module name in `import from`) to be transformed
 * @return {string|undefined} WordPress script handle to map the request to. Return `undefined`
 *   to use the same name as the module.
 */
export function defaultRequestToHandle(request: string): undefined | string {
	switch (request) {
		case '@babel/runtime/regenerator':
			return 'wp-polyfill';

		case 'lodash-es':
			return 'lodash';
		default:
			return wpackioRequestToHandle(request);
	}
}

/**
 * Get the name of the file from a file path.
 *
 * @param name Full path of the filename.
 * @returns Just the name of the file.
 */
export function basename(name: string) {
	if (!name.includes('/')) {
		return name;
	}
	return name.substr(name.lastIndexOf('/') + 1);
}

function md5(data: crypto.BinaryLike | string) {
	return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Build a file path to a lock file in the tmp directory
 *
 * @param {string} filename
 */
export function getLockFilename(filename: string) {
	const name = path.basename(filename);
	const dirHash = md5(path.dirname(filename));

	return path.join(os.tmpdir(), `${dirHash}-${name}.lock`);
}

/**
 * Create a lockfile (async)
 *
 * @param {string} filename
 */
export async function lock(filename: string) {
	await new Promise<void>((resolve, reject) => {
		lockfile.lock(
			getLockFilename(filename),
			{ wait: 6000, retryWait: 100, stale: 5000, retries: 100 },
			err => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			}
		);
	});
}

/**
 * Remove a lockfile (async)
 *
 * @param {string} filename
 */
export async function unlock(filename: string) {
	await lfUnlock(getLockFilename(filename));
}
