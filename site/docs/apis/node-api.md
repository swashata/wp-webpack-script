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

## `getFileLoaderOptions`

Get options for file-loader. This takes into account the application directory,
development or production mode and public path for file-loader usage from css files.

If you want to use `file-loader` for your own custom asset management, then
do use this API for dynamically setting the option. This ensures a few things, like

1. All assets are put inside `assets` directory.
2. Assets works for CSS files where relative path is necessary.

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
			webpackConfig: (config, api, appDir, isDev) => {
				const newRules = {
					module: {
						rules: [
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: [
									loader: 'file-loader',
									options: getFileLoaderOptions(appDir, isDev, false),
								],
							},
						],
					},
				};
				return api(config, newRules);
			}
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
