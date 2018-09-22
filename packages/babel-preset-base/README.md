# `@wpw/babel-preset-base`

This is the default base babel preset to include in non-react projects. It is
based on `@babel/preset-env` and includes some [`stage-3`](https://github.com/babel/babel/blob/master/packages/babel-preset-stage-3/README.md) plugins.

### `extends`

> `@babel/preset-env`.

You should add `.browserslistrc` to your project to target your environment.
More information can be found [here](https://babeljs.io/docs/en/next/babel-preset-env#browserslist-integration).

If you have incorporated using `@wpw/cli`, it is already taken care for you.

### Plugins

The following babel plugins from `stage-3` are included as dependency. They will
be loaded by default, but you can disable it through options.

-   `@babel/plugin-syntax-dynamic-import`
-   `@babel/plugin-syntax-import-meta`
-   `@babel/plugin-proposal-class-properties` - with option `{ "loose": false }`.
-   `@babel/plugin-proposal-json-strings`

### Usage

```bash
yarn add @wpw/babel-preset-base --dev
```

In your `.babelrc` put

```json
{
	"extends": ["@wpw/base"]
}
```

or in your `babel.config.js`/`babelrc.js`

```js
module.exports = {
	extends: ['@wpw/base'],
};
```

> **NOTE**: `babel.config.js` is used for project wide configuration.
> Please [refer to the docs](https://babeljs.io/docs/en/config-files#project-wide-configuration) to find out which config formatting to use.

### Options

`@wpw/babel-preset-base` can be configured to select which `stage-3` plugins to
exclude.

**babelrc.js**

```js
module.exports = {
	extends: [
		'@wpw/base',
		{
			noDynamicImport: true, // disable @babel/plugin-syntax-dynamic-import
			target: 'not dead, > 0.25%', // browserslist query to pass to @babel/preset-env
		},
	],
};
```

#### `noDynamicImport`

`boolean`, defaults to `false`.

Set to true to disable [`@babel/plugin-syntax-dynamic-import`](https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import).

#### `noImportMeta`

`boolean`, defaults to `false`.

Set to true to disable [`@babel/plugin-syntax-import-meta`](https://babeljs.io/docs/en/babel-plugin-syntax-import-meta).

#### `noClassProperties`

`boolean`, defaults to `false`.

Set to true to disable [`@babel/plugin-proposal-class-properties`](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties).

#### `noJsonStrings`

`boolean`, defaults to `false`.

Set to true to disable [`@babel/plugin-proposal-json-strings`](https://babeljs.io/docs/en/babel-plugin-proposal-json-strings).

#### Options for `@babel/preset-env`

What-ever else you pass to the config, is passed directly to `@babel/preset-env`. This
gives you more control on how to configure the most stable `env` preset.

Please [read the documentation](https://babeljs.io/docs/en/babel-preset-env) for
available options.

In most cases, you just need to put a browser query in your `browserslist` like

```
> 0.25%, not dead
```

and you are good to go.

You can put it under `browserslist` directive under `package.json` or in a separate
[`.browserslistrc`](https://github.com/browserslist/browserslist) file.

We recommend `.browserslistrc` because it is shared across many tools. If you bootstrap
your project using `@wpw/cli`, then it will be created automatically.
