---
title: How code-splitting and dynamic Import works
order: 1
shortTitle: Dynamic Imports & publicPath
---

Glad you asked. The documentation at
[webpack `output.publicPath`](https://webpack.js.org/configuration/output/#output-publicpath)
says this is one `free` variable `__webpack_public_path__` which can be used to
define the `publicPath` where webpack would look to lazy-load (or on-demand
load) chunks.

## Concept of `publicPath`

When creating an SPA (Single Page Application), all the assets usually resides
at the root `dist` directory.

So given the following `webpack.config.js` file

```js
module.exports = {
	entry: './src/main.js',
	output: {
		// Create a dir dist in the project root
		path: path.resolve(__dirname, 'dist'),
		// filename
		filename: 'bundle.js',
		// The URL relative to the HTML file
		// Since we are starting with '/', webpack will always look
		// into http://example.com/dist/bundle.js
		// no matter the current URL
		publicPath: '/dist/',
	},
};
```

If we host the files statically and serve directly, then `bundle.js` would be
accessible from `http://example.com/dist/bundle.js`.

Relying on this theory, we have set `output.publicPath` to be `/dist/`. So if
`'./src/main.js'` has some sort of `import('...').then(({default}) => {})`,
webpack will look for the file `http://example.com/dist/chunkName.js` to load
the dynamic import.

This theory works really good, when we are in control of our HTML assets and
URL.

For example, we could very much put all the files inside `dist` to a CDN, and
change `publicPath` to `https://cdn.example.com/path/to/asset/dir`.

## Usage inside WordPress

### The problem

But when using WordPress, the static files of themes and plugins are located
inside `wp-content/themes` and `wp-content/plugins` directory. The URL of these
directories can be, pretty much anything.

Say, you have WordPress installed in a sub-directory, so the URL would be
`https://example.com/path/to/wp/wp-content/plugins/my-plugin/dist`.

There is no way, we can know what the URL would be, during build-time.

### The Solution

Luckily, from WordPress itself, we can very easily get the public URL of our
asset (`dist`) directory using functions like `plugins_url` or
`get_stylesheet_directory_uri`.

This is the concept we use at wpackio. So it boils down to:

#### 1: Generate publicPath with PHP library

With the PHP script, we generate the publicPath URL and put it in website head
within a `<script>` tag.

```html
<script type="text/javascript">
	window.__wpackIoAppNameOutputPath =
		'https://example.com/wp-content/plugins/my-plug/dist';
</script>
```

Where `__wpackIoAppNameOutputPath` is a unique variable generated through a
combination of your `appName` and `outputPath` from `wpackio.project.js` file.

#### 2: Modify JavaScript entry-point

Now a special entry-point is injected to all the `entry` members by wpackio. Say
you have (in your **`wpackio.project.js`**) something like this:

```js
module.exports = {
	// ...
	files: [
		// If this has length === 1, then single compiler
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
};
```

It gets converted into

```diff
-				main: ['./src/app/index.js'],
+				main: ['@wpackio/entrypoint/lib/index.js', './src/app/index.js'],
-				mobile: ['./src/app/mobile.js'],
+				mobile: ['@wpackio/entrypoint/lib/index.js', './src/app/mobile.js'],
```

Notice the extra `'@wpackio/entrypoint/lib/index.js'`.

This is a special module which has the following code

```js
if (__WPACKIO__) {
	__webpack_public_path__ = window[
		`__wpackIo${__WPACKIO__.appName}${__WPACKIO__.outputPath}`
	] as string;
}
```

Notice that we already have `window.__wpackIoAppNameOutputPath` set through PHP
script. But this runtime script has no knowledge of the runtime variable
`__WPACKIO__`.

This is where
[webpack definePlugin](https://webpack.js.org/plugins/define-plugin/) comes in
handy.

## Passing needed variable with `webpack.DefinePlugin`

Through our webpack config we have

```js
const plugins = [
	// Define env
	new webpack.DefinePlugin({
		'process.env.NODE_ENV': JSON.stringify(this.env),
		'process.env.BABEL_ENV': JSON.stringify(this.env),
		// Our own access to project config from the modules
		// mainly needed for the publicPath entrypoint
		__WPACKIO__: {
			appName: JSON.stringify(this.config.appName),
			outputPath: JSON.stringify(this.config.outputPath),
		},
	}),
];
```

This is how we pass in the needed `appName` and `outputPath` to our javascript
files.

## Why in production build

Now you may wonder why we couldn't use the same technique for development
server?

The reason is:

- We would like to have `webpack-dev-middleware` serve files from memory,
  instead of files. This gives greater speed and doesn't pollute your disk
  during HMR.
- For the above to work, we need to tell `webpack-dev-middleware` which URL the
  files should be served from.
- Hence, we assume our local dev server is always running from a domain root and
  the files are served from `/wp-content/plugins/my-plugin/dist`.

So if you have some plugin to change the path to `wp-content` or the directory
slug of `themes` and/or `plugins` within your development server, wpackio will
surely not work.

But given very rare chance of having such modification in development server, we
have settled with the compromise.

Do note that the limitation is valid only for development server. In production
build, the publicPath is generated dynamically which will always work.

Even so, if you are using `@wpackio/scripts` v2.8.0 or greater, you have another
option [`distPublicPath`](/apis/server-configuration/#distpublicpath-string)
which you can mention in your server configuration. This is useful if your
WordPress development server gives an URL to the
[`outputPath`](/apis/project-configuration/#outputpath-string) directory which
is not the standard output or if your WordPress isn't installed at the root
domain (like `http://localhost`), rather a directory (like
`http://localhost/proj1`).
