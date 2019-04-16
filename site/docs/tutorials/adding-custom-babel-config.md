---
title: Adding custom babel configuration to your project
order: 2
shortTitle: Adding Babel Config
---

By default `@wpackio/scripts` ignores all `babel.config.js` and `.babelrc` files
and passes its own configuration to `babel-loader`. This works great for most
of the projects. But you might want to pass custom babel configuration which is
aware of tests or perhaps needs some other custom plugins.

There are two safe approach to do this.

## Using project config

If your babel configuration is only needed for `@wpackio/scripts` and not any
other tooling (like jest), then you should be able to use the project configurations.

You will need to use [`babelPresetOptions` and `babelOverride`](https://wpack.io/apis/project-configuration/#jsbabelpresetoptions-object--tsbabelpresetoptions-object)
options to pass in custom values directly to `@wpackio/scripts`.

## Using custom babel.config.js

If you need shared babel config between `@wpackio/scripts` and some other tool,
then create a `babel.config.js` file in the your project root.

Now edit `wpackio.project.js` file and put

```js
module.exports = {
	// config
	// this tells wpackio-scripts to use your own babel.config.js file
	useBabelConfig: true,
};
```

Now `@wpackio/scripts` will not pass any options to `babel-loader` and it will
fallback to your own `babel.config.js` file.

Note that when doing this, you will lose the built-in abilities for react, typescript
etc. Because internally `@wpackio/scripts` passes the needed babel options to
`babel-loader` to parse and compile those files.

However you can easily achieve the same with the `getBabelPresets` [node.js API](/apis/node-api/).
Your `babel.config.js` file may look like this.

```js
import { getBabelPresets } from '@wpackio/scripts';

module.exports = api => {
	// create cache based on NODE_ENV
	api.cache.using(() => process.env.NODE_ENV);

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

Do keep in mind that you will have to pass in options like `hasReact`, `hasFlow`
etc again because `@wpackio/scripts` does not manage this file.
