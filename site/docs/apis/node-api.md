---
title: Node.js APIs provided by @wpackio/scripts
order: 4
shortTitle: Nodejs API
---

While `@wpackio/scripts` is meant to be used as a CLI tool, it does expose all
of the necessary node.js APIs to create your own CLI.

For now, the best place to check the exports is [the file](https://github.com/swashata/wp-webpack-script/blob/master/packages/scripts/src/index.ts) itself. Since we
develop in typescript and ship all `.d.ts` files, you will get IDE intellisense
by default.

Here are the documentation for a few APIs which are useful.

## `getBabelPresets`

Get babel configuration for compiling JavaScript or TypeScript files.

This is used internally to create babel config for `babel-loader`.

### Usage

**babel.config.js**

```js
import { getBabelPresets } from '@wpackio/scripts';

module.exports = api => {
	const presetOptions = {
		noDynamicImport: false,
		noImportMeta: false,
		noClassProperties: false,
		noJsonStrings: false,
		noTuntime: false,
		hasReact: true,
		presetEnv: {
			// Override Options for @babel/preset-env
			useBuiltIns: 'usage',
		},
		presetReact: {
			// Override Options for @babel/preset-react
		},
	};

	// make test aware changes
	const isTest = api.env('test');

	if (isTest) {
		// since jest only understands commonjs modules
		presetOptions.presetEnv.modules = 'commonjs';
	}

	const babelConfig = {
		presets: getBabelPresets(presetOptions, 'typescript'),
		plugins: ['@babel/plugin-proposal-private-methods'],
	};

	return babelConfig;
};
```

### Parameters

#### `presetOptions`

Options for `@wpackio/base`. It has the following interface.

```ts
interface PresetOptions {
	noDynamicImport?: boolean;
	noImportMeta?: boolean;
	noClassProperties?: boolean;
	noJsonStrings?: boolean;
	noRuntime?: boolean;
	hasReact?: boolean;
	presetEnv?: {};
	presetReact?: {};
	[x: string]: any;
}
```

More information can be found in the [source repository](https://github.com/swashata/wp-webpack-script/tree/master/packages/babel-preset-base).

#### `typeChecker`

Whether to include preset for `'flow'` or `'typescript'`. Leave `undefined` to ignore both.

Possible values are `'flow'`, `'typescript'` or `undefined`.

## `getDefaultBabelPresetOptions`

Get default options for [@wpackio/babel-preset-base](https://github.com/swashata/wp-webpack-script/tree/master/packages/babel-preset-base) considering whether project
has react and whether it is in development mode.

### Usage

```js
// include a few node-js APIs
const {
	getBabelPresets,
	getDefaultBabelPresetOptions,
	// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@wpackio/scripts');

module.exports = {
	// stuff...
	// Files we need to compile, and where to put
	files: [
		// some entrypoint
		{
			name: 'reactapp',
			entry: {
				main: ['./src/reactapp/index.jsx'],
			},
			webpackConfig: (config, merge, appDir, isDev) => {
				const customRules = {
					module: {
						rules: [
							// Config for custom .mjs file extension
							{
								test: /\.mjs$/,
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
								],
							},
						],
					},
				};

				// merge and return
				return merge(config, customRules);
			},
		},
	],
};
```

## `getFileLoaderOptions`

Get options for file-loader. This takes into account the application directory,
development or production mode and public path for file-loader usage from css files.

If you want to use `file-loader` for your own custom asset management, then
do use this API for dynamically setting the option. This ensures a few things, like

1. All assets are put inside `assets` directory.
2. Assets works for CSS files where relative path is necessary.

More information can be found in [`file-loader` tutorial](/tutorials/using-file-loader/).

### Usage

**wpackio.project.js**

```js
const { getFileLoaderOptions } = require('@wpackio/scripts');

module.exports = {
	// ... config
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/main.js'],
			},
			webpackConfig: (config, merge, appDir, isDev) => {
				const newRules = {
					module: {
						rules: [
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
								],
							},
						],
					},
				};
				return merge(config, newRules);
			},
		},
	],
};
```

### Parameters

#### `appDir` (`string`)

Application directory where we are going to put the asset.

#### `isDev` (`boolean`)

Whether for development or production build.

#### `publicPath` (`boolean`)

Whether or not to set publicPath for `file-loader`, depending on `isDev`.

## `issuer`

The API consists a family of [`webpack issuer`](https://webpack.js.org/configuration/module/#ruleissuer) utilities. Use them in conjunction with [`file-loader`](/tutorials/using-file-loader/) or
`url-loader`.

-   `issuerForNonStyleFiles`: Tests if files are not, `css`, `sass` and `scss`.
-   `issuerForStyleFiles`: Tests if files are one of `css`, `sass` or `scss`.
-   `issuerForNonJsTsFiles`: Tests if files are not, `js`, `jsx`, `ts` and `tsx`.
-   `issuerForJsTsFiles`: Tests if files are one of `js`, `jsx`, `ts` and `tsx`.

### Usage

**wpackio.project.js**

```js
const {
	getFileLoaderOptions,
	issuerForNonStyleFiles,
	issuerForStyleFiles,
	issuerForJsTsFiles,
	issuerForNonJsTsFiles,
	// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@wpackio/scripts');

module.exports = {
	// ...
	files: [
		{
			// ...
			webpackConfig: (config, merge, appDir, isDev) => {
				const customRule = {
					module: {
						rules: [
							{
								test: /\.pdf$/,
								issuer: issuerForJsTsFiles,
								use: [
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
						],
					},
				};
				return merge(config, customRule);
			},
		},
	],
};
```

## `loader`

When you want to extend webpack config you might run into issues when
specifying loaders directly like

```js
const module = {
	rules: [
		test: /\.someext$/,
		use: [
			{
				loader: 'file-loader',
			}
		],
	],
};
```

The above is would throw error saying, could not resolve `file-loader`. To
ease up sharing loaders across configuration, `@wpackio/scripts` expose
the following loaders.

```js
const {
	cssLoader,
	fileLoader,
	lessLoader,
	postCssLoader,
	sassLoader,
} = require('@wpackio/scripts');
```

All of the above corresponds to specific loaders. So you may now use

```js
const module = {
	rules: [
		test: /\.someext$/,
		use: [
			{
				loader: fileLoader,
			}
		],
	],
};
```
