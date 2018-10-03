import * as webpack from 'webpack';

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
	path: string;
	filename: string;
}

/**
 * Main Project Config shape under `wpackio.project.js` file.
 */
export interface ProjectConfig {
	type: 'theme' | 'plugin';
	slug: string;
	bannerConfig: BannerConfig;
	files: FileConfig[];
	hasReact: boolean;
	hasSass: boolean;
	externals?: webpack.Configuration['externals'];
	alias?: webpack.Resolve['alias'];
	errorOverlay?: boolean;
	optimizeSplitChunks: boolean;
	webpackConfig?: webpack.Configuration;
}

/**
 * The default configuration object.
 */
export const projectConfigDefault: ProjectConfig = {
	// Project Identity
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
		// 	filename: '[name].js',
		// 	path: path.resolve(process.cwd(), 'dist'),
		// },
		// If has more length, then multi-compiler
	],
	// Project specific config
	// Needs react?
	hasReact: true,
	// Needs sass?
	hasSass: true,
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
	// Extra webpack config to be passed directly
	webpackConfig: undefined,
};
