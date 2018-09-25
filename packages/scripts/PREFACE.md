## Things it need to do

-   Load project config file from cli --project-config or `wpw.project.config.js` (if present) `process.cwd`.
-   Load environment config file from cli --server-config or `wpw.dev.config.js` (if present) from `process.cwd`.
-   DO NOT RELY ON `process.env.NODE_ENV`. Rather set it automatically depending on cli commands.
    -   `start` - Start browsersync sever with webpack middleware.
    -   `build` - Compile files.
    -   `init` - Create a `wpw.dev.config.js` through asking some questions (only if the file is not present).
-   Also set `process.env.BABEL_ENV` so that `babel-loader` can play nice, (especially with the preset-react).

## Structure `wpw.project.config.js`

```js
module.exports = {
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		{
			entry: {
				// stuff
			},
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
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
```

## Draft

Possible `package.json`

```json
{
	"name": "@wpw/scripts",
	"version": "0.0.0",
	"description": "@wpws/scripts is a single dependency for using WordPress webpack script.",
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
