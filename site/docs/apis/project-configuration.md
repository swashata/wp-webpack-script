---
title: Project Configuration with wpackio.project.js
order: 1
shortTitle: Project Configuration
---

The `wpackio.project.js` file at the root of your workspace tells wpackio
how your project is to be compiled. When you bootstrap this file is created
for you.

> You should commit `wpackio.project.js` with your VCS.

A typical project file looks like this.

```js
module.exports = {
	// Project Identity
	appName: 'wpackplugin', // Unique name of your project
	type: 'plugin', // Plugin or theme
	slug: 'wpackio-plugin', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
	// Used to generate banners on top of compiled stuff
	bannerConfig: {
		name: 'WordPress WebPack Bundler',
		author: 'Swashata Ghosh',
		license: 'GPL-3.0',
		link: 'https://wpack.io',
		version: '1.0.0',
		copyrightText:
			'This software is released under the GPL-3.0 License\nhttps://opensource.org/licenses/GPL-3.0',
		credit: true,
	},
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			// If enabled, all WordPress provided external scripts, including React
			// and ReactDOM are aliased automatically. Do note that all `@wordpress`
			// namespaced imports are automatically aliased and enqueued by the
			// PHP library. It will not change the JSX pragma because of external
			// dependencies.
			optimizeForGutenberg: false,
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// If has more length, then multi-compiler
		{
			name: 'foo',
			entry: {
				main: ['./src/foo/foo.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// Another app just for showing react
		{
			name: 'reactapp',
			entry: {
				main: ['./src/reactapp/index.jsx'],
			},
		},
	],
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: 'dist',
	// Project specific config
	// Needs react?
	hasReact: true,
	// Whether or not to use the new jsx runtime introduced in React 17
	// this is opt-in
	// @see {https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html}
	useReactJsxRuntime: false,
	// Disable react refresh
	disableReactRefresh: false,
	// Needs sass?
	hasSass: true,
	// Externals
	externals: {
		jquery: 'jQuery',
	},
	// Webpack Aliases
	alias: undefined,
	// Show overlay on development
	errorOverlay: true,
	// Auto optimization by webpack
	// Split all common chunks with default config
	// <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
	// Won't hurt because we use PHP to automate loading
	optimizeSplitChunks: true,
	// Usually PHP and other files to watch and reload when changed
	watch: 'inc/**/*.php',
	// Use babel.config.js instead of built-in options
	useBabelConfig: false;
	// Hook into babeloverride so that we can add react-hot-loader plugin
	jsBabelOverride: defaults => ({
		...defaults,
		plugins: ['react-hot-loader/babel'],
	}),
	// Files that you want to copy to your ultimate theme/plugin package
	// Supports glob matching from minimatch
	// @link <https://github.com/isaacs/minimatch#usage>
	packageFiles: [
		'inc/**',
		'vendor/**',
		'dist/**',
		'*.php',
		'*.md',
		'readme.txt',
		'languages/**',
		'layouts/**',
		'LICENSE',
		'*.css',
	],
	// Path to package directory, relative to the root
	packageDirPath: 'package',
	// Level of zlib compression, when creating archive
	zlibLevel: 4,
};
```

Let's dive in deep with different options.

## `appName` (`string`)

The name of your application. It should be unique and you have to use the same
value with the PHP consumer library.

**NOTE**: This must be `camelCase`.

## `type` (`string`)

Either `plugin` or `theme`, depending on your WordPress project.

## `slug` (`string`)

The slug of your plugin or theme. This is the name of the directory put under
`wp-content/{themes,plugins}`. This is used only for development purpose and has
no significance on production build.

## `bannerConfig` (`Object`)

A configuration object for banner put above all minified code.

It has the following properties:

-   `name` (`string`): Name of application.
-   `author` (`string`): Author of application.
-   `version` (`string`): Version of application.
-   `link` (`string`): Homepage link of application.
-   `license` (`string`): License of application.
-   `copyrightText` (`string`): Additional copyright text.
-   `credit` (`boolean`): Whether to give wpackio a little credit ❤️.

## `files` (`Array`)

An array of file object. It defines which files to compile and supports code-splitting
with different entry-points.

Unlike [webpack entry-point](https://webpack.js.org/configuration/entry-context/#entry)
it has to be an array of object of a certain shape. First let us see an example.

```js
module.exports = {
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			optimizeForGutenberg: false,
			webpackConfig: undefined,
		},
	],
	// ...
};
```

Here we have passed only one file object to the `files` entry. In most of the cases
this is what we'd need. Our main `entry` will split codes depending on different
entry-points and the tooling will handle chunk-splitting, optimization, prevent
duplicates etc. More information is found [here](https://webpack.js.org/guides/code-splitting/).

Once again, do note that you do not really need to do anything apart from defining
`entry.property = string[]` logically. Just think about which single JS file
you will need to run a particular application. Even if you have only one property
under `entry`, then also (if needed) chunk-splitting will be applied.

If we were to pass multiple file object, then webpack would run in [multi-compiler](https://webpack.js.org/api/node/#multicompiler)
mode, separating dependency tree from each of the file object.

Each file object has two required and three optional properties. Here's the
interface.

```ts
interface EntryConfig {
	[x: string]: string[] | string;
}

interface FileConfig {
	name: string;
	entry: EntryConfig;
	hasTypeScript?: boolean;
	webpackConfig?:
		| webpack.Configuration
		| ((
				config: webpack.Configuration,
				api: merge,
				appDir: string,
				isDev: boolean
		  ) => webpack.Configuration);
}
```

#### `name` (`string`) **required**:

A unique name of this file entry. If you are using more than one file entry,
then make sure to give different names, otherwise the compiler might not work
in development mode.

#### `entry` (`object`) **required**:

This is the path (relative to project root) of files you would like to compile.

```js
const entry = {
	foo: ['./src/app/foo.js'],
	bar: './src/app/bar.js',
};
```

As you can see, we only support [Object Syntax of webpack entry](https://webpack.js.org/concepts/entry-points/#object-syntax).

The reason is, we do our own little magic ([covered in the concepts section](/concepts/)) to
define dynamic `publicPath` from WordPress API itself.

#### `webpackConfig` (`Function` | `Object` | `undefined`)

If you'd like to extend webpack configuration, then this is where you'd put your
code.

It can support both webpack configuration objects or function to get further
control. Kindly read the [_Extending Webpack Config_](/tutorials/extending-webpack-config/) under [tutorials](/tutorials/).

#### `optimizeForGutenberg` (`boolean`):

_since v6.0.0_

If enabled, then all of WordPress managed JavaScript files, including, React,
ReactDOM, lodash, lodash-es, jQuery and everything under `@wordpress` namespace
are automatically marked externals and loaded from global `wp` object.

The new PHP library automatically takes care of loading those WordPress scripts
so you don't have to do anything from your part.

##### Callback Function

The most powerful form is the function. It has the following signature

```ts
type webpackConfigCallback = (
	config: webpack.Configuration,
	merge: webpackMerge,
	appDir: string,
	isDev: boolean
) => webpack.Configuration;
```

###### `config` (`webpack.Configuration`)

The configuration calculated by `@wpackio/scripts` is passed as the first parameter.

###### `merge` (`webpackMerge`)

The [`webpack-merge`](https://github.com/survivejs/webpack-merge) passed as-is.

###### `appDir` (`string`)

Directory inside `outputPath` where all the assets are to be emitted.

###### `isDev` (`boolean`)

Whether the operation is going for development mode or production build.

#### `typeWatchFiles` (`string[]`)

Array of glob pattern for which typescript reports are to be notified.

#### `hasTypeScript` (`boolean` | `undefined`)

Explicitly disable typescript type assertions.

> More information about typescript related options can be found [here](/tutorials/adding-typescript/).

## `outputPath` (`string`):

Name of the directory (relative) where we would put the bundled and manifest
files. Defaults to `dist` and you should not commit this directory in your VCS.

**NOTE**: This must be a single directory name with `alphanumeric` `camelCase`.
You can not pass `rel/path/to/dist` here.

## `hasReact` (`boolean`):

Where you need support for react specific presets, like `jsx`.

## `useReactJsxRuntime` (`boolean`):

_since v6.0.0_

Whether or not to use the new jsx runtime introduced in React 17. This is opt-in
as of now. Please see [here for implications](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).

## `disableReactRefresh` (`boolean`):

When you have react for your project, wpackio will use react fast refresh
for seamless updates of components. Set this to `true` if you want to disable
it.

## `hasSass` (`boolean`):

Where you need support for sass/scss files. You need to install `node-sass` or
`dart-sass` and your project's devDependency yourself.

## `hasFlow` (`boolean`):

Whether you need support for [flowtype](https://flow.org/).

## `useBabelConfig` (`boolean`)

wpackio-scripts knowingly avoids any `babel.config.js` and `.babelrc` file from
`babel-loader`. If you wish to avoid this behavior and want to be in control
of babel configuration, set this option to true.

More information about it can be [read here](/tutorials/adding-custom-babel-config/).

## `jsBabelPresetOptions` (`object`) | `tsBabelPresetOptions` (`object`)

wpackio script uses its own [preset](https://github.com/swashata/wp-webpack-script/tree/master/packages/babel-preset-base)
for javascript and typescript files. Using this option you can pass in additional
config and it will be spread over the default one.

> `jsBabelPresetOptions` is applied for `js,jsx` files and `tsBabelPresetOptions`
> is applied for `ts.tsx` files.

## `jsBabelOverride` (`Function`) | `tsBabelOverride` (`Function`)

Pass in a callback function to completely override options for [`babel-loader`](https://github.com/babel/babel-loader#options)

The signature is

```ts
(
	defaults: string | { [x: string]: any }
) =>
string | { [x: string]: any }
```

Where `defaults` is the config created by tooling. Here's an example we used to
incorporate [react hot loader](https://github.com/gaearon/react-hot-loader).

```js
module.exports = {
	jsBabelOverride: defaults => ({
		...defaults,
		plugins: ['react-hot-loader/babel'],
	}),
	// ...
};
```

> `jsBabelOverride` is applied for `js,jsx` files and `tsBabelOverride`
> is applied for `ts.tsx` files.

## `externals` (`Object`)

Configure [webpack external runtime dependency](https://webpack.js.org/configuration/externals/#externals).

## `alias` (`Object`)

Configure [webpack `resolve.alias`](https://webpack.js.org/configuration/resolve/#resolve-alias).

## `errorOverlay` (`boolean`)

Whether to show overlay during development mode when some error has occurred.

## `optimizeSplitChunks` (`boolean`)

Whether or not to apply built-in optimization presets. Turn it off if you would
like to do things manually.

We have the default config from [webpack optimization split-chunks plugin](https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks)
with only exception of setting `chunks` to `'all'`. We can do it safely because
our PHP consumer library handles the enqueue.

## `watch` (`string`)

[Glob pattern](https://github.com/micromatch/micromatch) to watch additional
files and reload browser on change. Useful for watching `.php` files.

```js
module.exports = {
	watch: './(inc|includes)/**/*.php',
};
```

## `packageFiles` (`string[]`)

Array of [glob patterns](https://github.com/sindresorhus/cpy#usage) to copy
files to the `packageDirPath` directory. This is used to create the
distributable zip file.

WordPress allows uploading `.zip` files to install both theme and plugins.
This option provides you a way to create such `.zip` file with `wpackio-scripts pack` command.

## packageDirPath (`string`)

Relative path of directory where we would put the package files. You should
add it to your `.gitignore` file. A subdirectory with name same as [`slug`](#slug-string)
will always be created inside it.

The generated package file will also have name like `<slug>.zip`.

## zlibLevel (`number`)

The level of zlib compression to use when creating the zip.
