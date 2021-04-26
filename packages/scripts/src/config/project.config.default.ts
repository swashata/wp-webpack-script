import webpack from 'webpack';
import { merge } from 'webpack-merge';

import { PresetOptions } from '@wpackio/babel-preset-base/lib/preset';

// Export common interfaces

/**
 * Configuration shape for banner. Inserted in the generated files on production.
 */
export interface BannerConfig {
	name: string;
	author: string;
	version: string;
	link: string;
	license: string;
	copyrightText: string;
	credit: boolean;
}

/**
 * Shape of `entry` property under `files`.
 */
export interface EntryConfig {
	[x: string]: string[] | string;
}

/**
 * Shape of single object under `files` property(array).
 */
export interface FileConfig {
	name: string;
	entry: EntryConfig;
	hasTypeScript?: boolean;
	webpackConfig?:
		| webpack.Configuration
		| ((
				config: webpack.Configuration,
				api: typeof merge,
				appDir: string,
				isDev: boolean
		  ) => webpack.Configuration);
	optimizeForGutenberg?: boolean;
}

export type webpackOptionsOverrideFunction = (
	// tslint:disable-next-line:no-any
	defaults: string | { [x: string]: any }
) => // tslint:disable-next-line:no-any
string | { [x: string]: any };

export type webpackLoaderOptionsOverride =
	| webpackOptionsOverrideFunction
	// tslint:disable-next-line:no-any
	| { [x: string]: any }
	| string
	| undefined;

/**
 * Main Project Config shape under `wpackio.project.js` file.
 */
export interface ProjectConfig {
	appName: string;
	type: 'theme' | 'plugin';
	slug: string;
	bannerConfig: BannerConfig;
	files: FileConfig[];
	/**
	 * The relative path of the output directory, w.r.t the directory
	 * from where the script has been called.
	 *
	 * It has to be relative, otherwise we possibly can not make
	 * hot-reload work.
	 *
	 * The script should be called from the root of your project. Otherwise
	 * we can not know how to create the URL of assets.
	 */
	outputPath: string;
	hasReact: boolean;
	disableReactRefresh?: boolean;
	hasSass: boolean;
	useReactJsxRuntime?: boolean;
	hasLess?: boolean;
	hasFlow: boolean;
	// Use babel.config.js instead of built-in options
	useBabelConfig?: boolean;
	// If provided it is spread over whatever wpackio/scripts generates
	jsBabelPresetOptions?: PresetOptions;
	// If provided it is spread over whatever wpackio/scripts generates
	tsBabelPresetOptions?: PresetOptions;
	// Completely overrides `babel-loader` options for javascript files
	jsBabelOverride?: webpackLoaderOptionsOverride;
	// Completely overrides `babel-loader` options for typescript files
	tsBabelOverride?: webpackLoaderOptionsOverride;
	externals?: webpack.Configuration['externals'];
	alias?: webpack.Resolve['alias'];
	errorOverlay?: boolean;
	optimizeSplitChunks: boolean;
	watch?: string | string[];
	packageFiles: string[];
	packageDirPath: string;
	zlibLevel?: number;
}

/**
 * The default configuration object.
 */
export const projectConfigDefault: ProjectConfig = {
	// Project Identity
	appName: 'wpackio', // Unique name of your project
	type: 'plugin', // Plugin or theme
	slug: 'wpack-io', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
	// Used to generate banners on top of compiled stuff
	bannerConfig: {
		name: 'WordPress WebPack Bundler',
		author: 'Swashata Ghosh',
		license: 'GPL-3.0',
		link: 'https://wpack.io',
		version: '1.0.0',
		copyrightText:
			'This software is released under the GPL-3.0 License\nhttps://opensource.org/licenses/GPL-3.0',
		credit: true,
	},
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		// {
		// 	name: 'mobile',
		// 	entry: {
		// 		// stuff
		// 		vendor: 'vendor.js',
		// 		main: ['src/mobile.js'],
		// 	},
		// 	// Extra webpack config to be passed directly
		// 	webpackConfig: undefined,
		// },
		// If has more length, then multi-compiler
	],
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: 'dist',
	// Project specific config
	useBabelConfig: false,
	// Needs react?
	hasReact: true,
	// Whether or not to use the new jsx runtime introduced in React 17
	// this is opt-in
	// @see {https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html}
	useReactJsxRuntime: false,
	// Disable react refresh
	disableReactRefresh: false,
	// Needs sass?
	hasSass: true,
	// Needs flow?
	hasFlow: false,
	// Externals
	externals: {
		jquery: 'jQuery',
	},
	// Webpack Aliases
	alias: undefined,
	// Show overlay on development
	errorOverlay: true,
	// Auto optimization by webpack
	// Split all common chunks with default config
	// <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
	// Won't hurt because we use PHP to automate loading
	optimizeSplitChunks: true,
	// Usually PHP and other files to watch and reload when changed
	watch: 'inc/**/*.php',
	// Files that you want to copy to your ultimate theme/plugin package
	// Supports glob matching from minimatch
	// @link <https://github.com/isaacs/minimatch#usage>
	packageFiles: [
		'inc/**',
		'vendor/**',
		'dist/**',
		'*.php',
		'*.md',
		'readme.txt',
		'languages/**',
		'layouts/**',
		'LICENSE',
		'*.css',
	],
	// Path to package directory, relative to the root
	packageDirPath: 'package',
	// Level of zlib compression, when creating archive
	zlibLevel: 4,
};
