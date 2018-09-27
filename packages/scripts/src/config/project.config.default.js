// @flow
import path from 'path';

export type bannerConfigType = {
	name: string,
	author: string,
	license: string,
	link: string,
	version: string,
	copyrightText: string,
	credit: boolean,
};

export default {
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
		{
			name: 'mobile',
			entry: {
				// stuff
				vendor: 'vendor.js',
				main: ['src/mobile.js'],
			},
			filename: '[name].js',
			path: path.resolve(process.cwd(), 'dist'),
		},
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
	alias: {},
	// Show overlay on development
	errorOverlay: true,
	// Auto optimization by webpack
	// Split all common chunks with default config
	// <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
	// Won't hurt because we use PHP to automate loading
	optimizeSplitChunks: true,
	// Extra webpack config to be passed directly
	webpackConfig: false,
};
