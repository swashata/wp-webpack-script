---
title: Using various SVG Loaders
order: 3
shortTitle: Use SVG Loaders
---

SVGs are all the rage in today's web. There are may ways, especially with webpack,
to consume SVGs, that I felt, it is best to leave it to the user-land to decide
which method to pick.

Each of them has their purpose and depending on your project, you should decide
which method (or combination of methods) to use.

## [Webpack Inline SVG Loader](https://webpack.js.org/loaders/svg-inline-loader/#configuration)

This one is from [official webpack contrib.](https://webpack.js.org/loaders/svg-inline-loader/).
It simply inlines the SVG within your code and gives you a string representing
the SVG (XML) code.

### Configure

First install the dependency

```bash
npm i svg-inline-loader --save-dev
```

Now edit your `wpackio.project.js` file and modify `webpackConfig` of `files`
array.

**`wpackio.project.js`**

```js
module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				// stuff
			},
			// Extra webpack config to be dynamically created
			webpackConfig: (config, merge, appDir, isDev) => {
				// create a new module.rules for svg-inline-loader
				const customRules = {
					module: {
						rules: [
							// Inline svg loader
							// https://webpack.js.org/loaders/svg-inline-loader/#configuration
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: ['svg-inline-loader'],
							},
						],
					},
				};
				// merge and return
				return merge(config, customRules);
			},
		},
	],
	// ...
};
```

## [SVGO Loader](https://github.com/rpominov/svgo-loader)

A loader for webpack to pass your SVG files through [svgo](https://github.com/svg/svgo) optimizer. It needs to work with either
[`file-loader`](https://github.com/webpack-contrib/file-loader) or [`url-loader`](https://github.com/webpack-contrib/url-loader).

### Configure

First install the dependency

```bash
npm i svgo svgo-loader --save-dev
```

Now edit your `wpackio.project.js` file and modify `webpackConfig` of `files`
array.

**`wpackio.project.js`**

```js
const {
	getFileLoaderOptions,
	issuerForNonStyleFiles,
	issuerForStyleFiles,
	babelLoader,
	fileLoader,
} = require('@wpackio/scripts');

module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				// stuff
			},
			// Extra webpack config to be dynamically created
			webpackConfig: (config, merge, appDir, isDev) => {
				const svgoLoader = {
					loader: 'svgo-loader',
					options: {
						{ removeTitle: true },
						{ convertColors: { shorthex: false } },
						{ convertPathData: false },
					},
				};
				// create module rules
				const configWithSvg = {
					module: {
						rules: [
							// SVGO Loader
							// https://github.com/rpominov/svgo-loader
							// This rule handles SVG for javascript files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: [
									{
										loader: fileLoader,
										options: getFileLoaderOptions(
											appDir,
											isDev,
											false
										),
									},
									svgoLoader,
								],
								issuer: issuerForNonStyleFiles,
							},
							// This rule handles SVG for style files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								use: [
									{
										loader: fileLoader,
										options: getFileLoaderOptions(
											appDir,
											isDev,
											true
										),
									},
									svgoLoader,
								],
								issuer: issuerForStyleFiles,
							},
						],
					},
				};
				// merge the new module.rules with webpack-merge api
				return merge(config, configWithSvg);
			},
		},
	],
	// ...
};
```

## [svgr webpack loader](https://github.com/smooth-code/svgr/tree/master/packages/webpack)

This one is specific for [react](https://reactjs.org). It transforms SVGs into
react components.

### Configure

First install the dependency

```bash
npm i @svgr/webpack --save-dev
```

Now edit your `wpackio.project.js` file and modify `webpackConfig` of `files`
array.

**`wpackio.project.js`**

```js
const {
	getFileLoaderOptions,
	getBabelPresets,
	getDefaultBabelPresetOptions,
	issuerForJsTsFiles,
	issuerForNonJsTsFiles,
	babelLoader,
	fileLoader,
	// eslint-disable-next-line import/no-extraneous-dependencies
} = require('@wpackio/scripts');

module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			// Extra webpack config to be dynamically created
			webpackConfig: (config, merge, appDir, isDev) => {
				const customRules = {
					module: {
						rules: [
							// Config for SVGR in javascript/typescript files
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								issuer: issuerForJsTsFiles,
								use: [
									{
										loader: babelLoader,
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
									{
										loader: '@svgr/webpack',
										options: { babel: false },
									},
									{
										loader: fileLoader,
										options: getFileLoaderOptions(
											appDir,
											isDev,
											false
										),
									},
								],
							},
							// For everything else, we use file-loader only
							{
								test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
								issuer: issuerForNonJsTsFiles,
								use: [
									{
										loader: fileLoader,
										options: getFileLoaderOptions(
											appDir,
											isDev,
											true
										),
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
	// ...
};
```

There are may other ways to configure svgr. Be sure to check their [documentation](https://github.com/smooth-code/svgr).

The things to watch here are

1. We disable `babel-loader` from `@svgr/webpack` and use `babel-loader` manually
   with `@wpackio/scripts` API.
2. We use `@svgr/webpack` only for JS/TS files using the `issuer` option along
   with `issuerForNonJsTsFiles` and `issuerForJsTsFiles` APIs.
