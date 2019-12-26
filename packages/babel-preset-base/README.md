# `@wpackio/babel-preset-base`

This is the default base babel preset to include in projects. It is
based on `@babel/preset-env`, `@babel/preset-react` and includes some [`stage-3`](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-3/README.md) plugins.

## Installation

If using `yarn`

```bash
yarn add @wpackio/babel-preset-base @babel/core --dev
```

or with `npm`

```bash
npm i @wpackio/babel-preset-base @babel/core --save-dev
```

## Usage

In your `.babelrc` put

```json
{
	"extends": ["@wpackio/base"]
}
```

or in your `babel.config.js`/`babelrc.js`

```js
module.exports = {
	extends: ['@wpackio/base'],
};
```

Per [babel package naming shorthands](https://babeljs.io/docs/en/presets#preset-shorthand)
we can use both `@wpackio/base` or `@wpackio/babel-preset-base` as the preset name.

> **NOTE**: `babel.config.js` is used for project wide configuration.
> Please [refer to the docs](https://babeljs.io/docs/en/config-files#project-wide-configuration) to find out which config formatting to use.

## Configuration

### `.browserslistrc`

This preset is primarily based on `@babel/preset-env` and `@babel/preset-react`.

You should add `.browserslistrc` to your project to target your environment.
More information can be found [here](https://babeljs.io/docs/en/next/babel-preset-env#browserslist-integration).

In most cases, you just need to put a browser query in your `.browserslistrc` like

```
> 0.25%, not dead
```

and you are good to go.

You can also put it under `browserslist` directive under `package.json` file.

We recommend `.browserslistrc` because it is shared across many tools. If you bootstrap
your project using `npx @wpackio/scripts bootstrap`, then it will be created automatically.

### Options

The following babel plugins from `stage-3` are included as dependencies. They will
be loaded by default, but you can disable it through options.

-   `@babel/plugin-syntax-dynamic-import`
-   `@babel/plugin-syntax-import-meta`
-   `@babel/plugin-proposal-class-properties` - with option `{ "loose": false }`.
-   `@babel/plugin-proposal-json-strings`
-   `@babel/plugin-transform-runtime` - with options `{corejs: false, helpers: true, regenerator: true, useESModules: true }`
-   `@babel/plugin-proposal-nullish-coalescing-operator`

`@wpackio/babel-preset-base` can be configured to select which `stage-3` plugins to
exclude.

**`babelrc.js`**

```js
module.exports = {
	extends: [
		'@wpackio/base',
		{
			noDynamicImport: true, // disable @babel/plugin-syntax-dynamic-import
			presetEnv: {
				target: 'not dead, > 0.25%', // browserslist query to pass to @babel/preset-env
			},
		},
	],
};
```

#### `hasReact`

`boolean`, defaults to `true`.

Set to `false` to completely disable all [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react) configuration.

#### `noDynamicImport`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-syntax-dynamic-import`](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import).

#### `noImportMeta`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-syntax-import-meta`](https://babeljs.io/docs/en/babel-plugin-syntax-import-meta).

#### `noClassProperties`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).

#### `noJsonStrings`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-proposal-json-strings`](https://babeljs.io/docs/en/babel-plugin-proposal-json-strings).

#### `noRuntime`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-transform-runtime`](https://babeljs.io/docs/en/babel-plugin-transform-runtime).

#### `noOptionalChaining`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-proposal-optional-chaining`](https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining).

#### `noNullishCoalescingOperator`

`boolean`, defaults to `false`.

Set to `true` to disable [`@babel/plugin-proposal-nullish-coalescing-operator`](https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator).

#### `presetEnv` Options for `@babel/preset-env`

`object`, defaults to `{}`.

What-ever you pass to the `presetEnv` directive, is passed directly to `@babel/preset-env`. This
gives you more control on how to configure the `@babel/preset-env` preset.

Please [read the documentation](https://babeljs.io/docs/en/babel-preset-env) for
available options.

#### `presetReact` Options for `@babel/preset-react`

`object`, defaults to `{}`.

What ever you define here, is passed directly to [`@babel/preset-react`](https://babeljs.io/docs/en/babel-preset-react).
So consult the documentation to find out how to use it.

##### Note on `presetReact.development`

`@babel/preset-react` has an option [`development`](https://babeljs.io/docs/en/babel-preset-react#development) which,
if enabled, includes two development friendly plugins. `@wpackio/babel-preset-base` automatically
sets its value, depending on `BABEL_ENV` environment variable. This environment
variable is taken care of automatically, when you are using `@wpackio/scripts`.

However, you can pass a `Boolean` value to `presetReact.development` and it will
be used instead.

**`.babelrc`**

```json
{
	"extends": [
		[
			"@wpackio/babel-preset-base",
			{
				"presetReact": {
					"development": false
				}
			}
		]
	]
}
```

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`. All type definitions are stripped and individual type declaration files are created.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `lint`: Lint all files using eslint.
-   `test`: Run tests on files using jest.
