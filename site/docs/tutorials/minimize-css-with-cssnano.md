---
title: Minimize CSS files with cssnano
order: 2
---

wpack.io uses [`postcss-loader`](https://github.com/postcss/postcss-loader) and thereby [PostCSS](https://postcss.org/). So
we can take advantage of it to minify our CSS/SASS files during production builds.

> **NOTE** - wpackio-scripts only extracts CSS/SASS, doesn't minify it. It is
> purposefully kept in the user-land because there are other options than cssnano.

## Install and use cssnano

[cssnano](https://cssnano.co/) is a postcss based minify and optimizer for CSS.

To use it, first we add it to our project's devDependency.

```bash
npm i -D cssnano
```

or with yarn

```bash
yarn add --dev cssnano
```

## Edit `postcss.config.js` file

When you [install](../guides/getting-started.md) wpackio a `postcss.config.js`
file is created for you. Edit it and replace it's content with

```js
/* eslint-disable global-require, import/no-extraneous-dependencies */
const postcssConfig = {
	plugins: [require('autoprefixer')],
};

// If we are in production mode, then add cssnano
if (process.env.NODE_ENV === 'production') {
	postcssConfig.plugins.push(
		require('cssnano')({
			// use the safe preset so that it doesn't
			// mutate or remove code from our css
			preset: 'default',
		})
	);
}

module.exports = postcssConfig;
```

Save it and you are good to go.

Note that only when you run `npm run build`, the CSS files will be minified. It
is not minified during `npm start` (development mode) to keep things fast. It is
actually controlled from the `postcss.config.js` file itself, hence we add it
conditionally in `if (process.env.NODE_ENV === 'production')`.
