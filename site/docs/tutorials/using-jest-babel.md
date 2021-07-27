---
title: Using Jest and ESlint with babel
order: 4
shortTitle: Use Jest & ESLint
---

If you are using [jest](https://jestjs.io) to test your project, and
[ESLint](https://eslint.org) for linting then you might want to add a
`babel.config.js` file for uniform babel rules.

## Using Same rule without customization

By default, `@wpackio/scripts` ignores any `babel.config.js` and `.babelrc`
files. So even if you do put such files in your project root, those will be
picked up by Jest or ESLint, but not by `@wpackio/scripts`. In small use cases,
this is perhaps the intended feature. In this case, create a `babel.config.js`
file in the root of your project and put the following code.

**babel.config.js**

```js
import {
	getBabelPresets,
	getDefaultBabelPresetOptions,
} from '@wpackio/scripts';

module.exports = api => {
	// create cache based on NODE_ENV
	api.cache.using(() => process.env.NODE_ENV);

	// make use of some configuration
	const isDev = api.env('development');
	const isTest = api.env('test');
	const hasReact = true;

	const presetOptions = getDefaultBabelPresetOptions(hasReact, isDev);

	// If test, then change modules and targets
	// since jest works in node and understands only cjs modules
	if (isTest) {
		presetOptions.presetEnv.targets = {
			node: 'current',
		};
		presetOptions.presetEnv.modules = 'commonjs';
	}

	// Now get the presets and create babel config
	// assuming we are using typescript
	// otherwise don't pass anything to the second parameter of getBabelPresets
	// or pass 'flow` for flowtype
	const babelConfig = {
		presets: getBabelPresets(presetOptions, 'typescript'),
	};

	// return it
	return babelConfig;
};
```

The above will create same babel rule for jest and eslint as used internally by
`@wpackio/scripts`.

## Override `@wpackio/scripts` rules

If you want to completely remove any babel rule set by `@wpackio/scripts` and
would only want to use one single `babel.config.js` instead, do the followings.

#### Instruct `@wpackio/scripts` to not pass any rule to babel-loader

Edit your `wpackio.project.js` file and put

```js
module.exports = {
	// config
	// this tells wpackio-scripts to use your own babel.config.js file
	useBabelConfig: true,
};
```

Now this will remove all rules from `babel-loader` for both javascript and
typescript files. So it will pick your own `babel.config.js` file.

Now go ahead and write your custom `babel.config.js` file making sure it matches
your project requirements. From now on, all tools including Jest, ESLint and
`@wpackio/scripts` will follow the same config.

For more information, do read the
[custom babel configuration](/tutorials/adding-custom-babel-config/) tutorial.
