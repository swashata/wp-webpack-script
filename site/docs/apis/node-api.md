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
