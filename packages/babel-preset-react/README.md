# `@wpw/babel-preset-react`

This is the react specific babel preset for `@wpw/scripts`. It inherits everything
from `@wpw/babel-preset-base` and expands on `@babel/preset-react`.

## Installation

If using `yarn`

```bash
yarn add @wpw/babel-preset-react @babel/core --dev
```

or with `npm`

```bash
npm i @wpw/babel-preset-react @babel/core --save-dev
```

## Usage

In your `.babelrc` put

```json
{
	"extends": ["@wpw/react"]
}
```

or in your `babel.config.js`/`babelrc.js`

```js
module.exports = {
	extends: ['@wpw/react'],
};
```

Per [babel package naming shorthands](https://babeljs.io/docs/en/presets#preset-shorthand)
we can use both `@wpw/react` or `@wpw/babel-preset-react` as the preset name.

> **NOTE**: `babel.config.js` is used for project wide configuration.
> Please [refer to the docs](https://babeljs.io/docs/en/config-files#project-wide-configuration) to find out which config formatting to use.

## Configuration

`@wpw/babel-preset-react` allows options to pass through both `@wpw/base` and
`@babel/preset-react`.

**`babelrc.js`**

```js
module.exports = {
	extends: [
		'@wpw/react',
		{
			// Pass to @wpw/base
			presetBase: {
				noDynamicImport: true, // disable @babel/plugin-syntax-dynamic-import
				presetEnv: {
					target: 'not dead, > 0.25%', // browserslist query to pass to @babel/preset-env
				},
			},
			// Pass to @babel/preset-react
			presetReact: {
				pragma: 'wp.element.createElement',
			},
		},
	],
};
```

### `presetReact`

`object`, defaults to `{}`.

What ever you define here, is passed directly to [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react).
So consult the documentation to find out how to use it.

#### Note on `presetReact.development`

`@babel/preset-react` has an option [`development`](https://babeljs.io/docs/en/babel-preset-react#development) which,
if enabled, includes two development friendly plugins. `@wpw/react` automatically
sets its value, depending on `BABEL_ENV` environment variable. This environment
variable is taken care of automatically, when you are using `@wpw/scripts`.

However, you can pass a `Boolean` value to `presetReact.development` and it will
be used instead.

**`.babelrc`**

```json
{
	"extends": [
		[
			"@wpw/react",
			{
				"presetReact": {
					"development": false
				}
			}
		]
	]
}
```

### `presetBase`

`object`, defaults to `{}`.

This is passed directly to [`@wpw/babel-preset-base`](https://github.com/swashata/wp-webpack-script/tree/master/packages/babel-preset-base).

You can have a `.browserslistrc` file, which will be detected by it and used.

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `watch`: Watch for changes in `src` and build in `lib`.
