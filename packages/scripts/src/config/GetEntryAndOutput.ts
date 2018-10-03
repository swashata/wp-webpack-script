import { FileConfig, ProjectConfig } from './project.config.default';

interface NormalizedEntry {
	[x: string]: string[];
}
interface Output {
	path: string;
	filename: string;
	publicPath: string;
}

interface Config {
	type: ProjectConfig['type'];
	slug: ProjectConfig['slug'];
	host: string;
	port: number;
}

/**
 * Get Webpack compatible configuration object with `entry` and `output`
 * properties.
 */
class GetEntryAndOutput {
	private file: FileConfig;
	private isDev: boolean;
	private config: Config;

	/**
	 * Create an instance of GetEntryAndOutput class.
	 */
	constructor(file: FileConfig, config: Config, isDev: boolean = true) {
		this.file = file;
		this.config = config;
		this.isDev = isDev;
	}

	/**
	 * Get webpack compatible entry configuration.
	 *
	 * The entry object has members which always has string[].
	 * This is to ensure that we can insert the hot loader client
	 * when necessary.
	 */
	public getEntry(): NormalizedEntry {
		// First destructure away the stuff we need
		const { name, entry } = this.file;
		// We intend to pass the entry directly to webpack,
		// but, we need to add the hot-middleware client to the entry
		// else it will simply not work
		const normalizedEntry: NormalizedEntry = {};
		// Loop over all user defined entries and add to the normalizedEntry
		Object.keys(entry).forEach((key: string) => {
			// We have to break and take the value in a separate
			// variable, otherwise typescript says all the weird
			// thing 😢
			// https://github.com/Microsoft/TypeScript/issues/10442#issuecomment-426203863
			const entryPoint: string[] | string = entry[key];
			normalizedEntry[key] = Array.isArray(entryPoint)
				? entryPoint
				: [entryPoint];
		});
		// Now, if in dev mode, then add the hot middleware client
		if (this.isDev) {
			// Custom overlay and it's styling
			// Custom style
			const overlayStyles: object = {
				zIndex: 999999999,
				fontSize: '14px',
				fontFamily:
					'Dank Mono, Operator Mono SSm, Operator Mono, Menlo, Consolas, monospace',
				padding: '32px 16px',
			};
			// Define the hot client string
			// Here we need
			// 1. dynamicPublicPath - Because we intend to use __webpack_public_path__
			// 2. overlay and overlayStypes - To enable overlay on errors, we don't need warnings here
			// 3. path - The output path, I am not sure if we need this, so let's skip
			// 4. name - Because it could be multicompiler
			const webpackHotClient: string = `webpack-hot-middleware/client?name=${name}&dynamicPublicPath=true&overlay=true&reload=true&overlayStyles=${encodeURIComponent(
				JSON.stringify(overlayStyles)
			)}`;
			// Now add to each of the entries
			// We don't know if user want to specifically disable for some, but let's
			// not think ahead of ourselves
			Object.keys(normalizedEntry).forEach((key: string) => {
				normalizedEntry[key].push(webpackHotClient);
			});
		}

		return normalizedEntry;
	}

	/**
	 * Get webpack compatible output object.
	 */
	public getOutput(): Output {
		// Now use the config to create a output
		// Destucture stuff we need from config
		const { type, slug, host, port } = this.config;
		// and file
		const { path, filename } = this.file;
		// Assuming it is production
		const output: Output = {
			path,
			filename,
			// leave blank because we would handle with free variable
			// __webpack_public_path__ in runtime.
			publicPath: '',
		};
		// Add the publicPath if it is in devMode
		if (this.isDev) {
			const contentDir: string = `${type}s`;
			// We are proxying stuff here. So I guess, we can safely assume
			// That URL of the proxied server starts from root?
			// Maybe we can have a `prefix` in Config, but let's not do that
			// right now.
			output.publicPath = `//${host ||
				'localhost'}:${port}/wp-content/${contentDir}/${slug}/`;
		}

		return output;
	}

	/**
	 * Get complete entry and output for using directly with
	 * webpack config.
	 */
	public getEntryAndOutput(): { entry: NormalizedEntry; output: Output } {
		return {
			entry: this.getEntry(),
			output: this.getOutput(),
		};
	}
}

module.exports = GetEntryAndOutput;
