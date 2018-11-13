---
title: Manually add node dependencies
order: 10
shortTitle: Manual Bootstrap
---

If for some reason, you don't want to use `@wpackio/cli` to bootstrap
dependencies, then we have you covered too.

First add the dependencies.

```bash
npm i @wpackio/entrypoint
```

**NOTE**: It needs to go into your project's `dependencies`, not in `devDepencencies`.
The reason is, it provides an entry-point (automatically inserted for you) which
handles the dynamic `publicPath` for webpack.

Now add `devDepencencies`.

```bash
npm i node-sass @wpackio/scripts -D
```

You will need it only if you are using Sass.

Now create the following files and edit the contents.

**wpackio.project.js**

```js
const pkg = require('./package.json');

module.exports = {
	// Project Identity
	appName: '{{appName}}', // Unique name of your project
	type: '{{type}}', // Plugin or theme
	slug: '{{slug}}', // Plugin or Theme slug, basically the directory name under `wp-content/<themes|plugins>`
	// Used to generate banners on top of compiled stuff
	bannerConfig: {
		name: '{{appName}}',
		author: '{{{author}}}',
		license: '{{license}}',
		link: '{{license}}',
		version: pkg.version,
		copyrightText:
			'This software is released under the {{license}} License\nhttps://opensource.org/licenses/{{license}}',
		credit: true,
	},
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		// {
		// 	name: 'mobile',
		// 	entry: {
		// 		// mention each non-interdependent files as entry points
		//      // The keys of the object will be used to generate filenames
		//      // The values can be string or Array of strings (string|string[])
		//      // But unlike webpack itself, it can not be anything else
		//      // <https://webpack.js.org/concepts/#entry>
		//      // You do not need to worry about file-size, because we would do
		//      // code splitting automatically. When using ES6 modules, forget
		//      // global namespace pollutions 😉
		// 		vendor: './src/mobile/vendor.js', // Could be a string
		// 		main: ['./src/mobile/index.js'], // Or an array of string (string[])
		// 	},
		// 	// Extra webpack config to be passed directly
		// 	webpackConfig: undefined,
		// },
		// If has more length, then multi-compiler
	],
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: '{{outputPath}}',
	// Project specific config
	// Needs react(jsx)?
	hasReact: {{hasReact}},
	// Needs sass?
	hasSass: {{hasSass}},
	// Needs flowtype?
	hasFlow: {{hasFlow}},
	// Externals
	// <https://webpack.js.org/configuration/externals/>
	externals: {
		jquery: 'jQuery',
	},
	// Webpack Aliases
	// <https://webpack.js.org/configuration/resolve/#resolve-alias>
	alias: undefined,
	// Show overlay on development
	errorOverlay: true,
	// Auto optimization by webpack
	// Split all common chunks with default config
	// <https://webpack.js.org/plugins/split-chunks-plugin/#optimization-splitchunks>
	// Won't hurt because we use PHP to automate loading
	optimizeSplitChunks: true,
	// Usually PHP and other files to watch and reload when changed
	watch: '{{watch}}',
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
};
```

**wpackio.server.js**

```js
module.exports = {
	// Your LAN IP or host where you would want the live server
	// Override this if you know your correct external IP (LAN)
	// Otherwise, the system will always use localhost and will not
	// work for external IP.
	// This will also create some issues with file watching because for
	// some reason, service-worker doesn't work on localhost?
	// https://github.com/BrowserSync/browser-sync/issues/1295
	// So it is recommended to change this to your LAN IP.
	// If you intend to access it from your LAN (probably do?)
	// If you keep null, then wpackio-scripts will try to determine your LAN IP
	// on it's own, which might not always be satisfying. But it is in most cases.
	host: undefined,
	// Your WordPress development server address
	// This is super important
	proxy: '{{proxy}}',
	// PORT on your localhost where you would want live server to hook
	port: 3000,
	// UI passed directly to browsersync
	ui: {
		port: 3001,
	},
	// Whether to show the "BrowserSync Connected"
	notify: false,
	// Open the local URL, set to false to disable
	open: true,
	// BrowserSync ghostMode, set to false to completely disable
	ghostMode: {
		clicks: true,
		scroll: true,
		forms: true,
	},
};
```

**postcss.config.js**

```js
/* eslint-disable global-require, import/no-extraneous-dependencies */
module.exports = {
	plugins: [require('autoprefixer')],
};
```

**.browserslistrc**

```
> 0.25%, not dead
```

Also edit your `package.json` and put the following in `scripts`.

```json
{
	"scripts": {
		"bootstrap": "wpackio-scripts bootstrap",
		"start": "wpackio-scripts start",
		"build": "wpackio-scripts build"
	}
}
```

Now you are ready to go. From here on, follow the guide on [Bootstrap](/guides/getting-started/).
