## Things it need to do

-   Load project config file from cli --project-config or `wpackio.project.js` (if present) `process.cwd`.
-   Load server config file from cli --server-config or `wpackio.server.js` (if present) from `process.cwd`.
-   DO NOT RELY ON `process.env.NODE_ENV`. Rather set it automatically depending on cli commands.
    -   `start` - Start browsersync sever with webpack middleware.
    -   `build` - Compile files.
    -   `init` - Create a `wpackio.server.json` through asking some questions (only if the file is not present).
-   Also set `process.env.BABEL_ENV` so that `babel-loader` can play nice, (especially with the preset-react).

## For the PHP Script

We will need to feed it the outputPath to keep things fast and not have it load the project.js
file.

```php
<?php

$enqueue = new \WPackio\Enqueue( $plugin_path, $output_path );
$enqueue->enqueue( 'entry_name' );
$enqueue->enqueue( 'entry_name', 'chunk_name' );
$enqueue->enqueue( 'entry_name', 'chunk_name', [
	'other' => 'localization',
] );
```

## Structure `wpackio.project.json`

```js
module.exports = {
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
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// If has more length, then multi-compiler
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
};
```

## Draft

Possible `package.json`

```json
{
	"name": "@wpackio/scripts",
	"version": "0.0.0",
	"description": "@wpackio/scripts is a single dependency for using WordPress webpack script.",
	"main": "index.js",
	"repository": "https://github.com/swashata/wp-webpack-script",
	"author": "Swashata Ghosh",
	"license": "MIT",
	"private": false,
	"dependencies": {
		"@babel/core": "^7.1.0",
		"@babel/plugin-proposal-class-properties": "^7.1.0",
		"@babel/plugin-proposal-object-rest-spread": "^7.0.0",
		"@babel/preset-env": "^7.1.0",
		"@babel/preset-react": "^7.0.0",
		"autoprefixer": "^9.1.5",
		"babel-loader": "^8.0.2",
		"browser-sync": "^2.24.7",
		"clean-webpack-plugin": "^0.1.19",
		"cross-env": "^5.2.0",
		"css-loader": "^1.0.0",
		"mini-css-extract-plugin": "^0.4.3",
		"optimize-css-assets-webpack-plugin": "^5.0.1",
		"postcss-loader": "^3.0.0",
		"sass-loader": "^7.1.0",
		"style-loader": "^0.23.0",
		"uglifyjs-webpack-plugin": "^2.0.1",
		"webpack": "^4.19.1",
		"webpack-dev-middleware": "^3.3.0",
		"webpack-hot-middleware": "^2.24.0"
	},
	"publishConfig": {
		"access": "public"
	}
}
```
