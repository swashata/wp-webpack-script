import { babelPreset } from '@wpackio/babel-preset-base/lib/preset';
import cleanWebpackPlugin from 'clean-webpack-plugin';
import miniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import slugify from 'slugify';
import webpack from 'webpack';
import {
	BannerConfig,
	FileConfig,
	ProjectConfig,
} from './project.config.default';
import { ServerConfig } from './server.config.default';

interface NormalizedEntry {
	[x: string]: string[];
}

export interface WebpackConfigHelperConfig {
	type: ProjectConfig['type'];
	slug: ProjectConfig['slug'];
	host: ServerConfig['host'];
	port: ServerConfig['port'];
	outputPath: ProjectConfig['outputPath'];
	hasReact: ProjectConfig['hasReact'];
	hasSass: ProjectConfig['hasSass'];
	bannerConfig: BannerConfig;
	alias?: ProjectConfig['alias'];
	optimizeSplitChunks: ProjectConfig['optimizeSplitChunks'];
}

interface CommonWebpackConfig {
	context: webpack.Configuration['context'];
	devtool: webpack.Configuration['devtool'];
	target: webpack.Configuration['target'];
	watch: webpack.Configuration['watch'];
	mode: webpack.Configuration['mode'];
}

/**
 * A helper class to get different configuration of webpack.
 */
export class WebpackConfigHelper {
	private file: FileConfig;
	private isDev: boolean;
	private config: WebpackConfigHelperConfig;
	/**
	 * Context directory, from where we read the stuff and put stuff.
	 */
	private cwd: string;
	/**
	 * Simulated NODE_ENV string, used internally and defined
	 * in webpack with webpack.DefinePlugin.
	 */
	private env: 'development' | 'production';

	/**
	 * Create an instance of GetEntryAndOutput class.
	 */
	constructor(
		file: FileConfig,
		config: WebpackConfigHelperConfig,
		cwd: string,
		isDev: boolean = true
	) {
		this.file = file;
		this.config = config;
		this.cwd = cwd;
		this.isDev = isDev;
		if (isDev) {
			this.env = 'development';
		} else {
			this.env = 'production';
		}
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
	public getOutput(): webpack.Output {
		// Now use the config to create a output
		// Destucture stuff we need from config
		const { type, slug, host, port, outputPath } = this.config;
		// and file
		const { name, filename } = this.file;
		const outputInnerDir: string = slugify(name, { lower: true });
		// Assuming it is production
		const output: webpack.Output = {
			// Here we create a directory inside the user provided outputPath
			// The name of the directory is the sluggified verion of `name`
			// of this configuration object.
			// Also here we assume, user has passed in the correct `relative`
			// path for `outputPath`. Otherwise this will break.
			// We do not use path.resolve, because we expect outputPath to be
			// relative. @todo: create a test here
			path: path.join(this.cwd, outputPath, outputInnerDir),
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
				'localhost'}:${port}/wp-content/${contentDir}/${slug}/${outputPath}/${outputInnerDir}`;
		}

		return output;
	}

	/**
	 * Get WebPack plugins, depending on development or production
	 */
	public getPlugins(): webpack.Plugin[] {
		// Add common plugins
		const plugins: webpack.Plugin[] = [
			// Define env
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': this.env,
				'process.env.BABEL_ENV': this.env,
			}),
			// Clean dist directory
			new cleanWebpackPlugin(['dist']),
			// Initiate mini css extract
			new miniCssExtractPlugin({
				filename: '[name].css',
			}),
		];
		// Add development specific plugins
		if (this.isDev) {
			plugins.push(
				// Hot Module Replacement
				new webpack.HotModuleReplacementPlugin()
			);
		} else {
			// Add Production specific plugins
			const { bannerConfig } = this.config;
			const creditNote: string =
				'Compiled with the help of https://wpack.io\nA zero setup Webpack Bundler Script for WordPress';
			plugins.push(
				// Banner plugin
				new webpack.BannerPlugin({
					entryOnly: false,
					raw: false,
					// Add to ts, tsx, css, scss, sass
					include: /\.((t|j)sx?|s?(c|a)ss)$/,
					banner: `
${bannerConfig.name}

@author ${bannerConfig.author}
@version ${bannerConfig.version}
@link ${bannerConfig.link}
@license ${bannerConfig.license}

Copyright (c) ${new Date().getFullYear()} ${bannerConfig.author}

${bannerConfig.copyrightText}

${bannerConfig.credit ? creditNote : ''}
`,
				})
			);
		}

		// Return it
		return plugins;
	}

	/**
	 * Get module object for webpack, depending on environment.
	 */
	public getModule(): webpack.Module {
		const { hasReact, hasSass } = this.config;
		// create the babel rules for es6+ code
		const jsPresets: babelPreset[] = [['@wpackio/base', { hasReact }]];
		const jsRules: webpack.RuleSetRule = {
			test: /\.m?jsx?$/,
			use: ['babel-loader'],
			exclude: /(node_modules|bower_components)/,
			options: {
				presets: jsPresets,
			},
		};

		// create the babel rules for typescript code
		const tsPresets: babelPreset[] = [
			['@wpackio/base', { hasReact }],
			['@babel/preset-typescript'],
		];
		const tsRules: webpack.RuleSetRule = {
			test: /\.tsx?$/,
			use: ['babel-loader'],
			exclude: /(node_modules)/,
			options: {
				presets: tsPresets,
				plugins: [
					'@babel/proposal-class-properties',
					'@babel/proposal-object-rest-spread',
				],
			},
		};
		// Create style rules
		const styleRules: webpack.RuleSetRule = {
			test: /\.css$/,
			use: [
				this.isDev
					? 'style-loader'
					: {
							loader: miniCssExtractPlugin.loader,
							options: {
								sourceMap: true,
							},
					  },
				{
					loader: 'css-loader',
					options: {
						importLoaders: 1,
						sourceMap: true,
					},
				},
				'postcss-loader',
			],
		};
		// If we have sass, then add the stuff
		if (
			hasSass &&
			styleRules.use != null &&
			Array.isArray(styleRules.use)
		) {
			styleRules.test = /\.(sa|sc|c)ss$/;
			styleRules.use.push({
				loader: 'sass-loader',
				options: {
					sourceMap: true,
				},
			});
		}
		// create file rules
		const fileRules: webpack.RuleSetRule = {
			test: /\.(woff|woff2|eot|ttf|otf|svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
			use: [
				{
					loader: 'file-loader',
					options: {
						name: 'asset-[hash].[ext]',
						outputPath: 'assets/',
					},
				},
			],
		};

		return {
			rules: [jsRules, tsRules, styleRules, fileRules],
		};
	}

	/**
	 * Get webpack compatible resolve property.
	 */
	public getResolve(): webpack.Resolve {
		return {
			extensions: ['.js', '.jsx', '.ts', '.tsx'],
			alias: this.config.alias != null ? { ...this.config.alias } : {},
		};
	}

	/**
	 * Get optimization for webpack.
	 *
	 * We optimize all chunks because
	 */
	public getOptimization(): webpack.Options.Optimization | undefined {
		const { optimizeSplitChunks } = this.config;
		if (optimizeSplitChunks) {
			return {
				splitChunks: {
					chunks: 'all',
				},
			};
		}

		return undefined;
	}

	/**
	 * Get common configuration, depending on just environment.
	 */
	public getCommon(): CommonWebpackConfig {
		return {
			context: this.cwd,
			devtool: this.isDev ? 'inline-source-map' : 'source-map',
			target: 'web',
			watch: this.isDev,
			mode: this.env,
		};
	}
}
