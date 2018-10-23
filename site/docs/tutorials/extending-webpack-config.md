---
title: Extending webpack configuration
order: 1
---

wpackio depends on [webpack](https://webpack.js.org) to create the dev server
and production build. It does provide a way to extend and override webpack
configuration it creates.

Since wpackio can operate in both single and multi compiler mode, we provide
method to extend webpack configuration for each of the webpack compiler. The
extend option is actually accepted through the `files` property of `project config`.

## Extending through `files` property

As written in the `project-configuration` section, `files` is what defines different
entry-point of your project and decides whether webpack should be run in single
compiler mode or multi-compiler mode (without any compromise).

A typical `files` entry may look like this:

**`wpackio.project.js`**

```js
module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
	],
	// ...
};
```

As you might have guessed, we patch through `webpackConfig` to extend configuration.

### Extend with Object

Put overriding webpack configuration object and it will be merged with
[webpack merge](https://github.com/survivejs/webpack-merge).

```js
module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
				mobile: ['./src/app/mobile.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: {
				module: {
					rules: [
						{
							test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
							use: [
								{
									loader: 'svg-inline-loader?classPrefix',
								},
							],
						},
					],
				},
			},
		},
	],
	// ...
};
```

### Extend with function

Even more flexibility can be obtained by using a callback function. It has the
following signature.

```ts
(webpackConfig: webpack.Configuration, webpackMergeApi: webpackMerge) =>
	webpack.Configuration;
```

So it will take two parameters:

-   `webpackConfig` (`Object`) : What the system has generated as your webpack
    config.
-   `webpackMergeApi` (`Function`): The [webpack merge](https://github.com/survivejs/webpack-merge)
    instance for direct usage.

And it should return a valid webpack configuration object.

An example could be

```js
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
			webpackConfig: (config, api) => {
				// Create a new config
				const newConfig = { ...config };
				// Extend the rules for some great svg experience
				newConfig.module.rules = [
					...newConfig.module.rules,
					// Use svgr for loading svg in react
					// https://github.com/smooth-code/svgr/tree/master/packages/webpack#handle-svg-in-css-sass-or-less
					{
						test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
						issuer: {
							test: /\.(j|t)sx?$/,
						},
						use: ['babel-loader', '@svgr/webpack', 'url-loader'],
					},
					// Use url-loader for everything else
					{
						test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
						use: [
							{
								loader: 'url-loader',
							},
						],
					},
				];
				// Return it
				return newConfig;
			},
		},
	],
	// ...
};
```

## Word of caution

The consumer PHP library, publicPath, development server and many internals
actually depend upon the proper structuring of `entry`, `output` and `publicPath`
of webpack configuration. If you override those, then the system may not work
correctly.

In most of the situations, you would actually want to add more loaders or modify
existing loaders. Feel free to do that by changing `config.module.rules` and
you should be good to go.
