---
order: 2
title: How does <span class="wpackio-logo-text">wpack.<em>io</em></span> work?
---

Glad you asked. Behind the scene, <span class="wpackio-logo-text">wpack.<em>io</em></span> works on top of
[webpack](https://webpack.js.org) and [browser-sync](https://browsersync.io/).

We use `webpack-dev-middleware` and `webpack-hot-middleware` to compile and serve
files during development. When these middleware are fed into browserSync, we get
all the _HMR_ goodies.

But there are a few things we have to keep in mind so that webpack and WordPress
play good together.

It is possible to have multiple webpack compiled assets. So [`output.jsonpFunction`](https://webpack.js.org/configuration/output/#output-jsonpfunction)
needs to be unique.

Unlike standalone applications, we do not have definite control of where our
assets are served from. It resides inside `plugin` or `theme` directory. So
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath)
has to be set during runtime. We also need a way to tell webpack in a conflict
free way about this `publicPath`.

In development server, we shouldn't set `publicPath` dynamically, rather have
it set to the `plugin` or `theme` output directory, considering WordPress is
installed at root. This is needed to make `webpack-hot-middleware` work.

There could be multiple webpack compiler (depending on `wpackio.project.js`),
but to keep things fast, we are passing only one instance of `webpack-dev` and
`webpack-hot` middleware. So we need to make sure:

-   the listen path of [`webpack-hot-middleware`](https://github.com/webpack-contrib/webpack-hot-middleware#client) is same across all webpack instances.
-   the `publicPath` of [`webpack-dev-middleware`](https://github.com/webpack/webpack-dev-middleware#publicpath) is same across all webpack instances.

We achieve this by having only one `dist` or `outputPath` in our config and
pointing `publicPath` towards it. Then in the actual [`output.filename`](https://webpack.js.org/configuration/output/#output-filename)
of webpack, we use sub-directory separator, like

```js
const outputFilename = `${file.name}/[name].js`;
```

This gives us conflict free configuration for any number of webpack compiler.

The whole webpack configuration is created on the fly, keeping all these things
in mind. I have tried to provide the best possible sane defaults, so that you
don't need to fiddle with the config. But if you want to, then it is only a

```js
module.exports = {
	// ...
	files: {
		name: 'app',
		entry: {
			main: './src/main.js',
		},
		webpackConfig: (config, mergeApi) => {
			return {
				...config,
				// Additional config
			};
		},
	},
};
```

away. But be extremely careful when doing this. If you fiddle with `config.entry`
and `config.output`, you will probably break stuff. In most of the cases, you will
never need to change those.
