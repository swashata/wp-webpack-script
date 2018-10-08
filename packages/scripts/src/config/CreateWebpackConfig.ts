import webpack from 'webpack';
import webpackMerge from 'webpack-merge';

import {
	FileConfig,
	ProjectConfig,
	projectConfigDefault,
} from './project.config.default';
import { ServerConfig, serverConfigDefault } from './server.config.default';
import { WebpackConfigHelper } from './WebpackConfigHelper';

export interface WpackConfig {
	config: webpack.Configuration;
	hmrPublicPath: string;
}

/**
 * Create the final webpack config through this class.
 */
export class CreateWebpackConfig {
	private projectConfig: ProjectConfig;
	private serverConfig: ServerConfig;
	private cwd: string;
	private isDev: boolean;
	private publicPath: string;

	/**
	 * Create an instance of GetWebpackConfig class.
	 *
	 * @param projectConfig Project configuration as recovered from user directory.
	 * @param serverConfig Server configuration as recovered from user directory.
	 * @param isDev Whether this is development mode.
	 */
	constructor(
		projectConfig: ProjectConfig,
		serverConfig: ServerConfig,
		cwd: string,
		isDev: boolean = true
	) {
		// Create final configuration
		// By doing a shallow override
		this.projectConfig = {
			...projectConfigDefault,
			...projectConfig,
		};
		this.serverConfig = {
			...serverConfigDefault,
			...serverConfig,
		};
		this.cwd = cwd;
		this.isDev = isDev;

		// Also figure out the publicPath beforehand, because we do need it
		const { slug, outputPath, type } = this.projectConfig;
		this.publicPath = `/wp-content/${type}s/${slug}/${outputPath}/`;
	}

	/**
	 * Get configuration object to feed to webpack.
	 *
	 * Depending on the project configuration, it could be for single compiler
	 * as well as multi compiler.
	 *
	 * If `projectConfig.files` has length === 1, then it would be a single compiler
	 * otherwise, it would be for multi compiler.
	 */
	public getWebpackConfig(): webpack.Configuration | webpack.Configuration[] {
		// Now it can be a single compiler, or multicompiler
		// In any case, figure it out, create the compiler options
		// and return the stuff.

		// If the configuration is for multiple compiler mode
		// Then return an array of config.
		if (this.projectConfig.files.length > 1) {
			// Return an array of configuration
			const config: webpack.Configuration[] = [];
			this.projectConfig.files.forEach((file: FileConfig) => {
				config.push(this.getSingleWebpackConfig(file));
			});

			return config;
		}

		// Otherwise, just return a single compiler mode config
		return this.getSingleWebpackConfig(this.projectConfig.files[0]);
	}

	/**
	 * Get devServer publicPath for all sorts of middlewares.
	 */
	public getPublicPath(): string {
		return this.publicPath;
	}

	/**
	 * Get Hot Module Reload Path, which takes into consideration
	 * the dynamicPublicPath.
	 */
	public getHmrPath(): string {
		return `${this.publicPath}__wpackio`;
	}

	/**
	 * Get server URL where the hot server is live and waiting to become
	 * awesome.
	 */
	public getServerUrl(): string {
		const { host, port } = this.serverConfig;

		return `//${host || 'localhost'}:${port}${this.publicPath}`;
	}

	/**
	 * Get Webpack Configuration for single compiler mode.
	 *
	 * @param file Single file object.
	 */
	private getSingleWebpackConfig(file: FileConfig): webpack.Configuration {
		const {
			type,
			slug,
			hasReact,
			hasSass,
			bannerConfig,
			alias,
			optimizeSplitChunks,
			outputPath,
			appName,
		} = this.projectConfig;
		const { host, port } = this.serverConfig;
		const helper: WebpackConfigHelper = new WebpackConfigHelper(
			file,
			{
				appName,
				type,
				slug,
				host,
				port,
				hasReact,
				hasSass,
				bannerConfig,
				alias,
				optimizeSplitChunks,
				outputPath,
				publicPath: this.getPublicPath(),
				serverUrl: this.getServerUrl(),
			},
			this.cwd,
			this.isDev
		);

		// Now create the config and return it
		let config: webpack.Configuration = {
			name: file.name,
			entry: helper.getEntry(),
			output: helper.getOutput(),
			module: helper.getModule(),
			plugins: helper.getPlugins(),
			resolve: helper.getResolve(),
			optimization: helper.getOptimization(),
			...helper.getCommon(),
		};

		// Merge options if needed
		// Loose comparison because it could very well be undefined
		if (file.webpackConfig != null) {
			config = webpackMerge(config, file.webpackConfig);
		}

		return config;
	}
}
