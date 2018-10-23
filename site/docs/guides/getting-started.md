---
title: Getting Started with wpack.io
order: 1
---

This guide covers in-depth how to get started or incorporate wpack.io tooling
into your WordPress project.

## Install the build tool

We have two way to get started with `@wpackio/scripts`.

### Bootstrap the files automatically

Using this way is recommended. It will not override any of your files and will
bootstrap needed files and `package.json` scripts automatically for you.

First cd into project directory.

```bash
cd awesome-plugin
```

Now run

```bash
npx @wpackio/cli
```

Once done, run

```bash
npm run bootstrap
```

OR if using `yarn` (the cli tool will auto-detect)

```bash
yarn bootstrap
```

This will create the following files:

-   `wpackio.project.js` - Information and entry-points for your project (plugin or theme).
-   `wpackio.server.js` - Information about your local development server. Make sure
    to add it to `.gitignore` file because it may differ for team members.
-   `.browserslistrc` - For targeting your environment. More info [here](https://github.com/browserslist/browserslist).
    It is used by both babel and autoprefixer to make sure your javascript and css
    files work as expected.
-   `postcss.config.js` - Additional configuration for your css files. Read [more](https://github.com/postcss/postcss#webpack). We have `autoprefixer` setup by default.

**NOTE** You must use `camelCase` format when defining `appName`. Otherwise it
will not work.

```js
// Good
module.exports = {
	appName: 'myAwesomeApp',
};

// BAD
module.exports = {
	appName: 'my-awesome-app',
};
```

Now you are ready to go.

### Bootstrap the files manually.

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

Now you are ready to go.

## Generate `server` config for team members

It is very much possible that different team members use different types of
local server. `@wpackio/scripts` doesn't come into you way and forces you to
change this.

Instead it provides a way to automatically generate server config for each of
your team member.

The only requirement here is to make sure you have `wpackio.server.js` in your
`.gitignore` file.

Then ask your members to run

```bash
npm run bootstrap
```

`@wpackio/scripts` will realize that the project is already configured and will
only ask the user for the URL of the `development` server. It is usually the
URL provided by wamp, mamp, vvv etc. Just enter that and the `wpackio.server.js`
will be automatically created for you.

## Install consumer tool

While `@wpackio/scripts` will generate the assets for you, you still need a
way to actually `wp_enqueue_script` the assets and define dynamic `publicPath`
to make them actually work.

This is where [`wpackio/enqueue`](https://packagist.org/packages/wpackio/enqueue)
comes in.

Install it through composer as your project dependency.

```bash
composer require wpackio/enqueue
```

Now instantiate it **early** and call the API.

```php
<?php
// Assuming this is the main plugin file.

// Require the composer autoload for getting conflict-free access to enqueue
require_once __DIR__ . '/vendor/autoload.php';

// Do stuff through this plugin
class MyPluginInit {
	/**
	 * @var \WPackio\Enqueue
	 */
	public $enqueue;

	public function __construct() {
		// It is important that we init the Enqueue class right at the plugin/theme load time
		$this->enqueue = new \WPackio\Enqueue( 'wpackplugin', 'dist', '1.0.0', 'plugin', __FILE__ );
		// Enqueue a few of our entry points
		add_action( 'wp_enqueue_scripts', [ $this, 'plugin_enqueue' ] );
	}


	public function plugin_enqueue() {
		$this->enqueue->enqueue( 'app', 'main', [] );
		$this->enqueue->enqueue( 'app', 'mobile', [] );
		$this->enqueue->enqueue( 'foo', 'main', [] );
	}
}


// Init
new MyPluginInit();
```

For more information do read the corresponding doc.
