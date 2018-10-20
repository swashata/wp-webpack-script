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
			webpackConfig: (config, api) => {
				// Create a new config
				const newConfig = { ...config };
				// Extend the rules for some great svg experience
				newConfig.module.rules = [
					...newConfig.module.rules,
					// Inline svg loader
					// https://webpack.js.org/loaders/svg-inline-loader/#configuration
					{
						test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
						use: ['svg-inline-loader'],
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
			webpackConfig: (config, api) => {
				// Create a new config
				const newConfig = { ...config };
				// Extend the rules for some great svg experience
				newConfig.module.rules = [
					...newConfig.module.rules,
					// SVGO Loader
					// https://github.com/rpominov/svgo-loader
					{
						test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
						use: [
							{ loader: 'file-loader' },
							{
								loader: 'svgo-loader',
								options: {
									plugins: [
										{ removeTitle: true },
										{ convertColors: { shorthex: false } },
										{ convertPathData: false },
									],
								},
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

There are may other ways to configure svgr. Be sure to check their [documentation](https://github.com/smooth-code/svgr).
