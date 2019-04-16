---
title: Safely using file-loader
order: 2
shortTitle: Using file-loader
---

If you want to use `file-loader` for your custom assets, then there are some
options you need to pass to make things work properly. To help you with that
we have exposed a few [nodejs APIs](/apis/node-api/).

The apis we need to use for `file-loader` are `getFileLoaderOptions`, `issuerForNonStyleFiles`, `issuerForStyleFiles`.

Say we want to load svg files with `file-loader`, for both JS/TS and CSS modules.

Here's what the `wpackio.project.js` would look like.

```js
const {
	getFileLoaderOptions,
	issuerForNonStyleFiles,
	issuerForStyleFiles,
} = require('@wpackio/scripts');

const webpackOverrideCallback = (config, merge, appDir, isDev) => {
	// just part of webpack config concerning our SVG
	const configWithSvg = {
		module: {
			rules: [
				// This rule handles SVG for JS/TS files
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: getFileLoaderOptions(appDir, isDev, false),
						},
					],
					issuer: issuerForNonStyleFiles,
				},
				// This rule handles SVG for style files
				{
					test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: getFileLoaderOptions(appDir, isDev, true),
						},
					],
					issuer: issuerForStyleFiles,
				},
			],
		},
	};

	// merge our custom rule with webpack-merge
	return merge(config, configWithSvg);
};

module.exports = {
	// ... config
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
			},
			webpackConfig: webpackOverrideCallback,
		},
		{
			name: 'mobile',
			entry: {
				main: ['./src/mobile/index.js'],
			},
			webpackConfig: webpackOverrideCallback,
		},
	],
};
```

Notice the use of `getFileLoaderOptions` inside the callback function. For style
type files, where the asset URL will come relative, it is necessary to pass the
third parameter as `true`.
