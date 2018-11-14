---
title: Use PHP API to consume assets
order: 2
shortTitle: Hook WordPress
---

While `@wpackio/scripts` will generate the assets for you, you still need a
way to actually `wp_enqueue_script` the assets and define dynamic `publicPath`
to make them actually work.

[`wpackio/enqueue`](https://github.com/swashata/wpackio-enqueue) is the PHP
companion of @wpackio/scripts.

It gives you all the APIs you will need to properly consume assets generated from `@wpackio/scripts` from your WordPress plugins or themes.

## Installation

### Using Composer

We recommend using [composer](https://getcomposer.org/) for using this [library](https://packagist.org/packages/wpackio/enqueue).

```bash
composer require wpackio/enqueue
```

Then in your plugin main file or `functions.php` file of your theme, load
composer auto-loader.

```php
<?php

// Require the composer autoload for getting conflict-free access to enqueue
require_once __DIR__ . '/vendor/autoload.php';

// Instantiate
$enqueue = new \WPackio\Enqueue( 'appName', 'outputPath', '1.0.0', 'plugin', __FILE__ );
```

### Manual

If you do not wish to use composer, then download the file [`Enqueue.php`](inc/Enqueue.php).

Remove the namespace line `namespace WPackio;` and rename the classname from
`Enqueue` to something less generic, like `MyPluginEnqueue`. This ensures
conflict-free loading.

Then require the file in your plugin entry-point or `functions.php` file of your theme.

```php
<?php

// Require the file yourself
require_once __DIR__ . '/inc/MyPluginEnqueue.php';

// Instantiate
$enqueue = new MyPluginEnqueue( 'appName', 'outputPath', '1.0.0', 'plugin', __FILE__ );
```

## Getting Started

Which ever way, you choose to install, you have to make sure to
**instantiate the class early** during the entry-point of your plugin or theme.

This ensures that we have necessary javascript in our website frontend and admin-end
to make webpack code-splitting and dynamic import work.

### Consuming assets for project

The PHP API must be instantiated in a way that it understands what you have
written in your `wpackio.project.js` file. Say your `appName` is `awesomePlugin` and your `files` entry look like this.

```js
module.exports = {
	appName: 'awesomePlugin',
	type: 'plugin', // Plugin or theme
	slug: 'wpackio-plugin', // plugin directory name
	// Output path relative to the context directory
	// We need relative path here, else, we can not map to publicPath
	outputPath: 'dist',
	// ...
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		{
			name: 'app',
			entry: {
				// In PHP: enqueue->enqueue( 'app', 'main', [] );
				main: ['./src/app/index.js'],
				// In PHP: enqueue->enqueue( 'app', 'mobile', [] );
				mobile: ['./src/app/mobile.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// If has more length, then multi-compiler
		{
			name: 'foo',
			entry: {
				// In PHP: enqueue->enqueue( 'foo', 'main', [] );
				main: ['./src/foo/foo.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// Another app just for showing react
		{
			name: 'reactapp',
			entry: {
				// In PHP: enqueue->enqueue( 'reactapp', 'main', [] );
				main: ['./src/reactapp/index.jsx'],
			},
		},
	],
	// ...
};
```

The following code shows you how you can consume, i.e, `wp_enqueue` all of
the assets.

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
		$this->enqueue = new \WPackio\Enqueue(
			// Name of the project, same as `appName` in wpackio.project.js
			'awesomePlugin',
			// Output directory, same as `outputPath` in wpackio.project.js
			'dist',
			// Version of your plugin
			'1.0.0',
			// Type of your project, same as `type` in wpackio.project.js
			'plugin',
			// Plugin location, pass false in case of theme.
			__FILE__
		);
		// Enqueue a few of our entry points
		add_action( 'wp_enqueue_scripts', [ $this, 'plugin_enqueue' ] );
	}

	public function plugin_enqueue() {
		// Enqueue files[0] (name = app) - entryPoint main
		$this->enqueue->enqueue( 'app', 'main', [] );
		// Enqueue files[0] (name = app) - entryPoint mobile
		$this->enqueue->enqueue( 'app', 'mobile', [] );
		// Enqueue files[1] (name = foo) - entryPoint main
		$this->enqueue->enqueue( 'foo', 'main', [] );
		// Enqueue files[2] (name = reactapp) - entryPoint main
		$this->enqueue->enqueue( 'reactapp', 'main', [] );
	}
}


// Init
new MyPluginInit();
```

## Why call it early?

It is required that you create an instance of the class, before `wp_head` and
`admin_head` hooks are called. It is needed because `WPackio\Enqueue` hooks in
early to print a small javascript like this:

```html
<script type="text/javascript">
	window.__wpackIoappNameoutputPath =
		'https://example.com/wp-content/plugins/plugin-slug/dist/';
</script>
```

This is single-handedly responsible for making webpack [dynamic publicPath](https://webpack.js.org/guides/public-path/#on-the-fly) work.

More information can be found about available methods in [PHP API](/apis/php-api/) docs.
