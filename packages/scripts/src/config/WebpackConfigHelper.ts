import {
	babelPreset,
	PresetOptions,
} from '@wpackio/babel-preset-base/lib/preset';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import slugify from 'slugify';
import TimeFixPlugin from 'time-fix-plugin';
import webpack from 'webpack';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { DependencyExtractionWebpackPlugin } from '../plugins/DependencyExtractionWebpackPlugin';

import { WatchMissingNodeModulesPlugin } from '../dev-utils';
import { WpackioError } from '../errors/WpackioError';
import { getBabelPresets, overrideBabelPresetOptions } from './babelConfig';
import {
	BannerConfig,
	FileConfig,
	ProjectConfig,
	webpackLoaderOptionsOverride,
	webpackOptionsOverrideFunction,
} from './project.config.default';
import { ServerConfig } from './server.config.default';
import {
	getFileLoaderForJsAndStyleAssets,
	getStyleLoaderUses,
} from './loaderHelpers';
import { hasTypeScript } from '../dev-utils/ops';

interface NormalizedEntry {
	[x: string]: string[];
}

export interface WebpackConfigHelperConfig {
	appName: ProjectConfig['appName'];
	type: ProjectConfig['type'];
	slug: ProjectConfig['slug'];
	host: ServerConfig['host'];
	port: ServerConfig['port'];
	outputPath: ProjectConfig['outputPath'];
	useBabelConfig: ProjectConfig['useBabelConfig'];
	hasReact: ProjectConfig['hasReact'];
	useReactJsxRuntime: ProjectConfig['useReactJsxRuntime'];
	disableReactRefresh: ProjectConfig['disableReactRefresh'];
	hasSass: ProjectConfig['hasSass'];
	hasFlow: ProjectConfig['hasFlow'];
	hasLess: ProjectConfig['hasLess'];
	jsBabelPresetOptions?: ProjectConfig['jsBabelPresetOptions'];
	tsBabelPresetOptions?: ProjectConfig['tsBabelPresetOptions'];
	jsBabelOverride?: ProjectConfig['jsBabelOverride'];
	tsBabelOverride?: ProjectConfig['tsBabelOverride'];
	bannerConfig: BannerConfig;
	alias?: ProjectConfig['alias'];
	optimizeSplitChunks: ProjectConfig['optimizeSplitChunks'];
	publicPath: string; // Not used right now, but maybe we will need it in future?
	publicPathUrl: string;
	errorOverlay: ProjectConfig['errorOverlay'];
	externals: ProjectConfig['externals'];
	// whether or not to disable wordpress external scripts handling
	disableWordPressExternals?: boolean;
}

interface CommonWebpackConfig {
	context: webpack.Configuration['context'];
	devtool: webpack.Configuration['devtool'];
	target: webpack.Configuration['target'];
	watch: webpack.Configuration['watch'];
	mode: webpack.Configuration['mode'];
	name: webpack.Configuration['name'];
	externals: webpack.Configuration['externals'];
	infrastructureLogging: any;
}

/**
 * A helper class to get different configuration of webpack.
 */
export class WebpackConfigHelper {
	// This is where all the filename will be prefixed, so we create a directory
	public readonly appDir: string;

	// Actual outputPath as provided by user
	public readonly outputPath: string;

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

		// Create the outputPath, because we would be needing that
		const { outputPath } = this.config;
		// and filename and inner directory name
		// this innerDir will be prefixed to all filename
		// because for multi-compiler to work, we need
		// outputPath and publicPath themselves on the same path.
		// all middlewares would actually use the `name` from webpack config
		// to separate updates.
		const { name } = this.file;
		this.appDir = slugify(name, { lower: true });
		this.outputPath = path.join(this.cwd, outputPath);
	}

	public static getHmrPath(): string {
		return `/__wpackio_hmr`;
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
				? // maybe we can go a step futher and put an entry point which takes
				  // care of the __webpack_public_path__
				  // like `@wpackio/publicpath?outputPath=${this.config.outputPath}&appName=${this.config.appName}`
				  entryPoint
				: [entryPoint];
		});
		// Now, if in dev mode, then add the hot middleware client
		if (this.isDev) {
			// Whether or not we use the react-refresh and family, we need the default
			// whm client for this to work.
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
			//
			// Here we need
			// 1. client - because it needs to be consistent across this and WHM.
			// 2. overlay and overlayStypes - To enable overlay on errors, we don't need warnings here
			// 3. path - The output path, We need to make sure both server and client has the same value.
			// 4. name - Because it could be multicompiler
			const webpackHotClient: string = `webpack-hot-middleware/client?path=${WebpackConfigHelper.getHmrPath()}&name=${name}${
				this.config.errorOverlay ? '&overlay=true' : ''
			}&reload=true&overlayStyles=${encodeURIComponent(
				JSON.stringify(overlayStyles)
			)}`;

			// Now add to each of the entries
			// We don't know if user want to specifically disable for some, but let's
			// not think ahead of ourselves
			Object.keys(normalizedEntry).forEach((key: string) => {
				normalizedEntry[key] = [
					// put webpack hot client in the entry at the top
					// otherwise HMR will stop working after an update
					webpackHotClient,
					...normalizedEntry[key],
				];
			});
		} else {
			// Put the publicPath entry point
			Object.keys(normalizedEntry).forEach((key: string) => {
				normalizedEntry[key] = [
					// We need it before any other entrypoint, otherwise it won't
					// work, if ES Modules are used.
					`@wpackio/entrypoint/lib/index`,
					...normalizedEntry[key],
				];
			});
		}

		return normalizedEntry;
	}

	/**
	 * Get webpack compatible output object.
	 */
	public getOutput(): webpack.Output {
		// Assuming it is production
		const output: webpack.Output = {
			// Here we create a directory inside the user provided outputPath
			// The name of the directory is the sluggified verion of `name`
			// of this configuration object.
			// Also here we assume, user has passed in the correct `relative`
			// path for `outputPath`. Otherwise this will break.
			// We do not use path.resolve, because we expect outputPath to be
			// relative. @todo: create a test here
			path: this.outputPath,
			filename: `${this.appDir}/${
				this.isDev ? '[name]' : '[name]-[contenthash:8]'
			}.js`,
			// leave blank because we would handle with free variable
			// __webpack_public_path__ in runtime.
			publicPath: '',
			// we need different jsonpFunction, it has to
			// be unique for every webpack config, otherwise
			// the later will override the previous
			// having combination of appName and file.name
			// kind of ensures that billions of devs, don't
			// override each other!!!!
			jsonpFunction: `wpackio${this.config.appName}${this.file.name}Jsonp`,
		};
		// Add the publicPath if it is in devMode
		if (this.isDev) {
			// This is calculated by CreateWebpackConfig
			// taking into consideration user's own value.
			// So, if WordPress defaults are changed, then
			// depending on wpackio.server.js, it will still
			// point to the right location. It only makes
			// dynamic import and some on-demand split-chunk
			// work.
			output.publicPath = this.config.publicPathUrl;
		}

		return output;
	}

	/**
	 * Get WebPack plugins, depending on development or production
	 */
	public getPlugins(): webpack.Plugin[] {
		// Add common plugins
		let plugins: webpack.Plugin[] = [
			// Define env
			new webpack.DefinePlugin({
				'process.env.NODE_ENV': JSON.stringify(this.env),
				'process.env.BABEL_ENV': JSON.stringify(this.env),
				...this.getEnvVariables(),
				// Our own access to project config from the modules
				// mainly needed for the publicPath entrypoint
				__WPACKIO__: {
					appName: JSON.stringify(this.config.appName),
					outputPath: JSON.stringify(this.config.outputPath),
				},
			}),
			// Clean dist directory
			(new CleanWebpackPlugin({
				verbose: false,
				cleanOnceBeforeBuildPatterns: [`${this.outputPath}/${this.appDir}`],
			}) as unknown) as webpack.Plugin,
			// Initiate mini css extract
			new MiniCssExtractPlugin({
				filename: `${this.appDir}/${
					this.isDev ? '[name]' : '[name]-[contenthash:8]'
				}.css`, // we do it this way, so that we can easily setup e2e tests, we can always predict what the name would be
				ignoreOrder: false,
			}),
			// Create Manifest for PHP Consumption
			(new WebpackAssetsManifest({
				writeToDisk: true,
				output: `${this.outputPath}/${this.appDir}/manifest.json`,
				publicPath: ``, // We dont put ${this.config.outputPath}/ here because, PHP will pick it up anyway.
				entrypoints: true,
				entrypointsKey: 'wpackioEp',
			}) as unknown) as webpack.Plugin,
		];
		// Add ts checker plugin if project has tsconfig.json
		const [isTs, tsconfigPath] = hasTypeScript(this.cwd);
		if (isTs && this.file.hasTypeScript !== false) {
			// dynamic require forktschecker otherwise it will throw error
			try {
				// eslint-disable-next-line import/no-extraneous-dependencies, global-require, @typescript-eslint/no-var-requires
				const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
				plugins.push(
					new ForkTsCheckerWebpackPlugin({
						async: this.isDev,
						typescript: {
							configFile: tsconfigPath,
							mode: 'write-references',
						},
						eslint: undefined,
						formatter: 'codeframe',
						logger: {
							infrastructure: 'silent',
							issues: 'silent',
						},
					})
				);
			} catch (e) {
				throw new WpackioError(e);
			}
		}

		// Add wordpress dependency extract plugin
		if (this.config.disableWordPressExternals !== true) {
			plugins.push(
				new DependencyExtractionWebpackPlugin({
					gutenbergOptimized: this.file.optimizeForGutenberg ?? false,
					appDir: this.appDir,
				})
			);
		}

		// Add development specific plugins
		if (this.isDev) {
			// Hot Module Replacement
			plugins.push(new webpack.HotModuleReplacementPlugin());
			// If you require a missing module and then `npm install` it, you still have
			// to restart the development server for Webpack to discover it. This plugin
			// makes the discovery automatic so you don't have to restart.
			// See https://github.com/facebook/create-react-app/issues/186
			plugins.push(
				new WatchMissingNodeModulesPlugin(
					path.resolve(this.cwd, './node_modules')
				)
			);
			// Add timewatch plugin to avoid multiple successive build
			// https://github.com/webpack/watchpack/issues/25
			plugins = [new TimeFixPlugin(), ...plugins];

			// Add react refresh if needed
			if (
				this.config.hasReact &&
				!this.config.disableReactRefresh &&
				!this.file.optimizeForGutenberg
			) {
				plugins.push(
					new ReactRefreshWebpackPlugin({
						overlay: {
							sockIntegration: 'whm',
						},
					})
				);
			}
		} else {
			// Add Production specific plugins
			const { bannerConfig } = this.config;
			const creditNote =
				'\n\nCompiled with the help of https://wpack.io\nA zero setup Webpack Bundler Script for WordPress';
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

${bannerConfig.copyrightText}${bannerConfig.credit ? creditNote : ''}`,
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
		const { hasReact, hasSass, hasFlow, hasLess } = this.config;
		const wpackioBabelOptions: PresetOptions = {
			hasReact,
			// use react jsx runtime only if enabled explicitly
			// and not optimizing for gutenberg
			useReactJsxRuntime:
				this.config.useReactJsxRuntime && !this.file.optimizeForGutenberg,
		};

		// check if babel.config.js is present
		const isBabelConfigPresent = this.config.useBabelConfig;

		// Push targets to babel-preset-env if this is dev
		// We target only the latest chrome and firefox for
		// greater speed
		if (this.isDev) {
			wpackioBabelOptions.presetEnv = {
				targets: {
					chrome: '69',
					firefox: '62',
					edge: '17',
				},
			};
		}

		// create the babel rules for es6+ code
		const jsPresets: babelPreset[] = getBabelPresets(
			overrideBabelPresetOptions(
				wpackioBabelOptions,
				this.config.jsBabelPresetOptions
			),
			hasFlow ? 'flow' : undefined
		);

		const jsRules: webpack.RuleSetRule = {
			test: /\.m?jsx?$/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: this.getFinalBabelLoaderOptions(
						isBabelConfigPresent
							? {}
							: this.getOverrideWebpackRuleOptions(
									{
										presets: jsPresets,
										// disable babelrc and babel.config.js
										// as it could potentially break stuff
										// rather use the jsBabelOverride
										configFile: false,
										babelrc: false,
									},
									this.config.jsBabelOverride
							  )
					),
				},
			],
			exclude: /(node_modules|bower_components)/,
		};

		// create the babel rules for typescript code
		const tsPresets: babelPreset[] = getBabelPresets(
			overrideBabelPresetOptions(
				wpackioBabelOptions,
				this.config.tsBabelPresetOptions
			),
			'typescript'
		);

		const tsRules: webpack.RuleSetRule = {
			test: /\.tsx?$/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: this.getFinalBabelLoaderOptions(
						isBabelConfigPresent
							? {}
							: this.getOverrideWebpackRuleOptions(
									{
										presets: tsPresets,
										// disable babelrc and babel.config.js
										// as it could potentially break stuff
										// rather use the jsBabelOverride
										configFile: false,
										babelrc: false,
										// We don't need plugin-proposal-class-properties
										// because taken care of by @wpackio/base
										// '@babel/proposal-class-properties',
										// We don't need object-rest-spread because it is
										// already in stage-4 and taken care of by preset-env
										// '@babel/proposal-object-rest-spread',
									},
									this.config.tsBabelOverride
							  )
					),
				},
			],
			exclude: /(node_modules)/,
		};

		// Compile node_modules
		const nmJsRules: webpack.RuleSetRule = {
			test: /\.(js|mjs)$/,
			// we exclude @babel/runtime and core-js
			exclude: /(@babel(?:\/|\\{1,2})runtime)|(core-js)/,
			include: /node_modules/,
			use: [
				{
					loader: require.resolve('babel-loader'),
					options: this.getFinalBabelLoaderOptions(
						{
							// preset from our own package
							presets: getBabelPresets({
								hasReact: false,
							}),
							// If an error happens in a package, it's possible to be
							// because it was compiled. Thus, we don't want the browser
							// debugger to show the original code. Instead, the code
							// being evaluated would be much more helpful.
							sourceMaps: false,
							// Babel assumes ES Modules, which isn't safe until CommonJS
							// dies. This changes the behavior to assume CommonJS unless
							// an `import` or `export` is present in the file.
							// https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
							sourceType: 'unambiguous',
							// disable babelrc and babel.config.js for node_modules
							configFile: false,
							babelrc: false,
						},
						false
					),
				},
			],
		};

		// Create style rules
		const styleRules: webpack.RuleSetRule[] = [
			{
				test: /\.css$/,
				use: [
					...getStyleLoaderUses(this.isDev, this.config.publicPathUrl, false),
				],
			},
		];
		// If we have sass, then add the stuff
		if (hasSass) {
			styleRules.push({
				test: /\.s(a|c)ss$/,
				use: [
					...getStyleLoaderUses(this.isDev, this.config.publicPathUrl, true),
					{
						loader: require.resolve('sass-loader'),
						options: {
							sourceMap: true,
						},
					},
				],
			});
		}
		// If we have less, then add the stuff
		if (hasLess) {
			styleRules.push({
				test: /\.less$/,
				use: [
					...getStyleLoaderUses(this.isDev, this.config.publicPathUrl, true),
					{
						loader: require.resolve('less-loader'),
						options: {
							sourceMap: true,
							lessOptions: {
								javascriptEnabled: true,
							},
						},
					},
				],
			});
		}

		// create file rules
		const {
			fileRulesNonStyle,
			fileRulesStyle,
		} = getFileLoaderForJsAndStyleAssets(this.appDir, this.isDev);

		return {
			rules: [
				jsRules,
				tsRules,
				nmJsRules,
				...styleRules,
				fileRulesNonStyle,
				fileRulesStyle,
			],
		};
	}

	/**
	 * Get webpack compatible resolve property.
	 */
	public getResolve(): webpack.Resolve {
		return {
			extensions: ['.mjs', '.js', '.jsx', '.ts', '.tsx'],
			alias: this.config.alias !== undefined ? { ...this.config.alias } : {},
		};
	}

	/**
	 * Get optimization for webpack.
	 *
	 * We optimize all chunks because
	 */
	public getOptimization(): webpack.Options.Optimization | undefined {
		const { optimizeSplitChunks } = this.config;
		const optimization: webpack.Options.Optimization = {
			// We set runtimeChunk to be single
			// because user can (and probably should)
			// have multiple entry-point on the same page
			runtimeChunk: 'single',
		};
		if (optimizeSplitChunks) {
			optimization.splitChunks = {
				chunks: 'all',
				minSize: 30000,
				minChunks: 1,
				maxAsyncRequests: 5,
				maxInitialRequests: 3,
				name: true,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
					},
					default: {
						minChunks: 2,
						priority: -20,
						reuseExistingChunk: true,
					},
				},
			};
		}

		return optimization;
	}

	/**
	 * Get common configuration, depending on just environment.
	 */
	public getCommon(): CommonWebpackConfig {
		return {
			context: this.cwd,
			devtool: this.isDev ? 'cheap-module-source-map' : 'source-map',
			target: 'web',
			watch: this.isDev,
			mode: this.env,
			name: this.file.name,
			externals: this.config.externals,
			infrastructureLogging: {
				level: 'none',
			},
		};
	}

	/**
	 * Get final babel loader options. This adds anything necessary for
	 * wpackio functions.
	 *
	 * @param options Existing babel loader options.
	 */
	private getFinalBabelLoaderOptions(
		options: webpack.RuleSetLoader['options'],
		addReactRefresh: boolean = true
	): webpack.RuleSetLoader['options'] {
		const finalOptions: webpack.RuleSetLoader['options'] =
			options && typeof options === 'object' ? { ...options } : {};

		if (
			this.config.hasReact &&
			!this.config.disableReactRefresh &&
			!this.file.optimizeForGutenberg &&
			addReactRefresh &&
			this.isDev
		) {
			if (!finalOptions.plugins) {
				finalOptions.plugins = [];
			}
			finalOptions.plugins.push(require.resolve('react-refresh/babel'));
		}

		const babelLoaderCacheOptions = {
			// This is a feature of `babel-loader` for webpack (not Babel itself).
			// It enables caching results in ./node_modules/.cache/babel-loader/
			// directory for faster rebuilds.
			cacheDirectory: true,
			cacheCompression: !this.isDev,
			compact: !this.isDev,
		};

		return {
			...finalOptions,
			...babelLoaderCacheOptions,
		};
	}

	/**
	 * Get final loader option based on user and system.
	 *
	 * @param defaults Default options as calculated by system.
	 * @param override User defined option.
	 */
	private getOverrideWebpackRuleOptions(
		defaults: webpack.RuleSetLoader['options'],
		override: webpackLoaderOptionsOverride
	): webpack.RuleSetLoader['options'] {
		// If override is not undefined or null, then return it
		if (override !== undefined) {
			// If it is a function
			if (typeof override === 'function') {
				return (override as webpackOptionsOverrideFunction)(
					defaults || {}
				) as webpack.RuleSetLoader['options'];
			}
			return override;
		}
		// Otherwise just return default
		return defaults;
	}

	private getEnvVariables() {
		const envVariables: Record<string, any> = {};
		const match = 'WPACKIO_';
		Object.keys(process.env ?? {}).forEach(key => {
			if (key.startsWith(match)) {
				envVariables[
					`process.env.${key.substring(match.length)}`
				] = JSON.stringify(process.env[key]);
			}
		});
		return envVariables;
	}

	/**
	 * Get calculated app directory
	 */
	public getAppDir(): string {
		return this.appDir;
	}
}
