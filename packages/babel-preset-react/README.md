# `@wpackio/babel-preset-react`

This is the react specific babel preset for `@wpackio/scripts`. It is based on `@babel/preset-react`.
It doesn't inherit from `@wpackio/base`, so make sure to include it in your babel config.

## Installation

If using `yarn`

```bash
yarn add @wpackio/babel-preset-react @babel/core --dev
```

or with `npm`

```bash
npm i @wpackio/babel-preset-react @babel/core --save-dev
```

## Usage

In your `.babelrc` put

```json
{
	"extends": ["@wpackio/react"]
}
```

or in your `babel.config.js`/`babelrc.js`

```js
module.exports = {
	extends: ['@wpackio/react'],
};
```

Per [babel package naming shorthands](https://babeljs.io/docs/en/presets#preset-shorthand)
we can use both `@wpackio/react` or `@wpackio/babel-preset-react` as the preset name.

> **NOTE**: `babel.config.js` is used for project wide configuration.
> Please [refer to the docs](https://babeljs.io/docs/en/config-files#project-wide-configuration) to find out which config formatting to use.

## Configuration

`@wpackio/babel-preset-react` allows options to pass through both `@wpackio/base` and
`@babel/preset-react`.

**`babelrc.js`**

```js
module.exports = {
	extends: [
		'@wpackio/react',
		{
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
if enabled, includes two development friendly plugins. `@wpackio/react` automatically
sets its value, depending on `BABEL_ENV` environment variable. This environment
variable is taken care of automatically, when you are using `@wpackio/scripts`.

However, you can pass a `Boolean` value to `presetReact.development` and it will
be used instead.

**`.babelrc`**

```json
{
	"extends": [
		[
			"@wpackio/react",
			{
				"presetReact": {
					"development": false
				}
			}
		]
	]
}
```

#### Why all `@babel/preset-react` is wrapped inside a separate object?

Because, right now, I can not know whether this preset would require any standalone
options for its own, like `@wpackio/base`. So I think, it is best to separate react
options in a separate hash. In future, if we need some other options, then it can
be conflict free.

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

-   `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`.
-   `prepare`: Run `build` after `yarn` and before `publish`.
-   `watch`: Watch for changes in `src` and build in `lib`.
