const pkg = require('./package.json');

module.exports = {
	// Project Identity
	appName: 'wpackioEToE', // Unique name of your project
	type: 'plugin', // Plugin or theme
	slug: 'e2e-plug', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
	// Used to generate banners on top of compiled stuff
	bannerConfig: {
		name: 'wpackioEToE',
		author: 'Swashata Ghosh (https://swas.io)',
		license: 'MIT',
		link: 'MIT',
		version: pkg.version,
		copyrightText:
			'This software is released under the MIT License\nhttps://opensource.org/licenses/MIT',
		credit: true,
	},
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		{
			name: 'app',
			entry: {
				main: ['./src/app/main.js'], // Or an array of string (string[])
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		{
			name: 'tsapp',
			entry: {
				main: './src/tsapp/main.ts',
			},
		},
		// If has more length, then multi-compiler
	],
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: 'dist',
	// Project specific config
	// Needs react(jsx)?
	hasReact: true,
	// Needs sass?
	hasSass: true,
	// Needs flowtype?
	hasFlow: false,
	// Externals
	// <https://webpack.js.org/configuration/externals/>
	externals: {
		jquery: 'jQuery',
	},
	// Webpack Aliases
	// <https://webpack.js.org/configuration/resolve/#resolve-alias>
	alias: undefined,
	// Show overlay on development
	errorOverlay: true,
	// Auto optimization by webpack
	// Split all common chunks with default config
	// <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
	// Won't hurt because we use PHP to automate loading
	optimizeSplitChunks: true,
	// Usually PHP and other files to watch and reload when changed
	watch: './inc|includes/**/*.php',
};
