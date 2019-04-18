// include a few node-js APIs
const {
	getFileLoaderOptions,
	issuerForNonStyleFiles,
	issuerForStyleFiles,
	getBabelPresets,
	getDefaultBabelPresetOptions,
	issuerForJsTsFiles,
	issuerForNonJsTsFiles,
	// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@wpackio/scripts');

module.exports = {
	// Project Identity
	appName: 'wpackplugin', // Unique name of your project
	type: 'plugin', // Plugin or theme
	slug: 'wpackio-plugin', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
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
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			hasTypeScript: false,
			// Extra webpack config to be passed directly
			webpackConfig: (config, merge, appDir, isDev) => {
				const svgoLoader = {
					loader: 'svgo-loader',
					options: {
						plugins: [
							{ removeTitle: true },
							{ convertColors: { shorthex: false } },
							{ convertPathData: false },
						],
					},
				};
				// create module rules
				const configWithSvg = {
					module: {
						rules: [
							// SVGO Loader
							// https://github.com/rpominov/svgo-loader
							// This rule handles SVG for javascript files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: [
									{
										loader: 'file-loader',
										options: getFileLoaderOptions(
											appDir,
											isDev,
											false
										),
									},
									svgoLoader,
								],
								issuer: issuerForNonStyleFiles,
							},
							// This rule handles SVG for style files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: [
									{
										loader: 'file-loader',
										options: getFileLoaderOptions(
											appDir,
											isDev,
											true
										),
									},
									svgoLoader,
								],
								issuer: issuerForStyleFiles,
							},
						],
					},
				};
				// merge the new module.rules with webpack-merge api
				return merge(config, configWithSvg);
			},
		},
		// If has more length, then multi-compiler
		{
			name: 'foo',
			entry: {
				main: ['./src/foo/foo.js'],
			},
			hasTypeScript: false,
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// Another app just for showing react
		// This also uses svgr-loader
		{
			name: 'reactapp',
			entry: {
				main: ['./src/reactapp/index.jsx'],
			},
			hasTypeScript: false,
			webpackConfig: (config, merge, appDir, isDev) => {
				const customRules = {
					module: {
						rules: [
							// Config for SVGR in javascript/typescript files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								issuer: issuerForJsTsFiles,
								use: [
									{
										loader: 'babel-loader',
										options: {
											presets: getBabelPresets(
												getDefaultBabelPresetOptions(
													true,
													isDev
												),
												undefined
											),
										},
									},
									{
										loader: '@svgr/webpack',
										options: { babel: false },
									},
									{
										loader: 'file-loader',
										options: getFileLoaderOptions(
											appDir,
											isDev,
											false
										),
									},
								],
							},
							// For everything else, we use file-loader only
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								issuer: issuerForNonJsTsFiles,
								use: [
									{
										loader: 'file-loader',
										options: getFileLoaderOptions(
											appDir,
											isDev,
											true
										),
									},
								],
							},
						],
					},
				};

				// merge and return
				return merge(config, customRules);
			},
		},
		{
			name: 'tsapp',
			// hasTypeScript: true,
			typeWatchFiles: ['src/ts/*.{ts,tsx}', 'src/ts/**/*.{ts,tsx}'],
			entry: {
				main: ['./src/ts/main.ts'],
			},
		},
	],
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: 'dist',
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
	// Usually PHP and other files to watch and reload when changed
	watch: 'inc/**/*.php',
	// Hook into babeloverride so that we can add react-hot-loader plugin
	jsBabelOverride: defaults => ({
		...defaults,
		plugins: ['react-hot-loader/babel'],
	}),
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
};
