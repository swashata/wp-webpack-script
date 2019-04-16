---
title: How everything works together
order: 2
shortTitle: How it works
---

This is an attempt to cover the working of this tooling. While this is really
_just_ a [webpack](https://webpack.js.org/) and [browser-sync](https://browsersync.io/) based tooling, there are a few cases
we had to consider to make sure it works nicely with WordPress.

## Choice of tooling

-   We use [webpack](https://webpack.js.org/) as the primary bundler.
-   [Browser Sync](https://browsersync.io/), along with `webpack-dev-middleware`
    acts as the development server.
-   `webpack-hot-middleware` is used to provide all the **HOT MODULE REPLACEMENT**
    (_HMR_) goodness.
-   `babel-loader` as the webpack module loader which uses babel under the hood
    to compile modern JavaScript/Typescript code.
-   `sass-loader`, `postcss-loader`, `autoprefixer` along with `mini-css-extract-plugin`
    to handle CSS/SASS/SCSS source.

Everything fits in together when we pass the middlewares to browsersync.

But there are a few things we have to keep in mind so that webpack and WordPress
play good together.

## Multiple webpack compiled assets

It is possible to have multiple webpack compiled assets. So [`output.jsonpFunction`](https://webpack.js.org/configuration/output/#output-jsonpfunction)
needs to be unique.

## Runtime publicPath (dynamic)

Unlike standalone applications, we do not have definite control of where our
assets are served from. It resides inside `plugin` or `theme` directory. So
[`output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath)
has to be set during runtime. We also need a way to tell webpack in a conflict
free way about this `publicPath`.

### During development

In development server, we shouldn't set `publicPath` dynamically, rather have
it set to the `plugin` or `theme` output directory, considering WordPress is
installed at root. This is needed to make `webpack-hot-middleware` work.

In case if the URL to the [`outputPath`](/apis/project-configuration/#outputpath-string) directory is not something like
`http://host.tld/wp-content/plugins/<slug>/<outputPath>/`, then we
have an option [`distPublicPath`](/apis/server-configuration/#distpublicpath-string)
which we can mention under `wpackio.server.js` file to define the URL path.
For example, if your WordPress dev server is serving from `http://localhost/wp-one`, then you can pass
`/wp-one/wp-content/plugins/<slug>/<outputPath>/`.

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

### During production

During production, we don't make any assumptions at all. The reason is the same,
we can not know if

1. WordPress is installed in root or not.
2. Whether `wp-content`, `plugins` and/or `themes` directory has been changed or not.

So what we do instead is, we provide webpack runtime dynamic `pubicPath` by setting
`__webpack_public_path__` variable.

If you want to know more about how publicPath works together with the PHP library
read [this concept note](/concepts/how-publicpath-works/).

## Single runtime for different entrypoints

While different webpack compiler instances are separated by different `output.jsonpFunction`
there's still one thing we need to consider.

**There should be only one runtime for every chunks**. If we put multiple runtimes
then the execution will be slower and there could be some race condition, overriding
our dynamic imports.

This is handled by telling webpack to [split the runtime through a common chunk](https://webpack.js.org/configuration/optimization/#optimization-runtimechunk)
and then *enqueue*ing it only once, using our PHP library.

## Enqueue common chunks only once

Say we have the following configuration for files.

```js
module.exports = {
	// ...
	files: [
		{
			name: 'app',
			entry: {
				main: './src/app/main.js',
				mobile: './src/app/mobile.js',
			},
		},
	],
};
```

Here it is very much possible, depending on our [dependency graph](https://webpack.js.org/concepts/dependency-graph/)
that both `main` and `mobile` ends up using similar libraries. With the optimization
in effect, webpack will create a common chunk for it, say `main~mobile~vendor.js`.

Now if we were to enqueue both `main` and `mobile` in the same page, then we should
take care that `main~mobile~vendor.js` is enqueued exactly once.

This is again handled by

1. Telling webpack to [optimize using SplitChunksPlugin](https://webpack.js.org/plugins/split-chunks-plugin/).
2. Generating unique `wp_enqueue` `$handle` through our PHP library.

In the background it just works, conflict free, thanks to the approach.

## Generate webpack config

Keeping all these things in mind, the whole webpack configuration is created on the fly. I have tried to provide the best possible sane defaults, so that you
don't need to fiddle with the config. But if you want to, then it is only a

```js
module.exports = {
	// ...
	files: {
		name: 'app',
		entry: {
			main: './src/main.js',
		},
		webpackConfig: (config, merge, appDir, isDev) => {
			return merge(config, {
				// additional config
			});
		},
	},
};
```

away. But be extremely careful when doing this. If you fiddle with `config.entry`
and `config.output`, you will probably break stuff. In most of the cases, you will
never need to change those.
