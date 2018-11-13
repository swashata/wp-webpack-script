---
title: Use PHP API to consume assets
order: 2
shortTitle: PHP Dependency
---

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

A common pattern may look like this.

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

## Creating Instance

While creating a class instance, you can pass in up-to 5 parameters.

```php
new \WPackio\Enqueue( $appName, $outputPath, $version, $type = 'plugin', $pluginPath = false );
```

#### `$appName` (`string`)

It has to be same as you have defined in `wpackio.project.js` under `appName`.

#### `$outputPath` (`string`)

It has to be same as you have defined in `wpackio.project.js` under `outputPath`.

#### `$version` (`string`)

Version of your plugin/theme.

#### `$type` (`string`)

Either `"plugin"` or "`theme`", depending on your project.

#### `$pluginPath` (`string`|`false`)

Absolute path to the main plugin file. If you are using it for `theme`, then don't
pass it, or just use `false`.

## Instance API: `getAssets`

Get handle and Url of all assets from the entry-point.
It doesn't enqueue anything for you, rather returns an associative array
with handles and urls. You should use it to enqueue it on your own.

### Usage

```php
<?php
$enqueue = new \WPackio\Enqueue( 'appName', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->getAssets( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'in_footer' => true,
	'media' => 'all',
] );

$jses = $assets['js'];
$csses = $assets['css'];

foreach ( $jses as $js ) {
	if ( $config['js'] ) {
		wp_enqueue_script( $js['handle'], $js['url'], [], '1.0.0', true );
	}
}

foreach ( $csses as $css ) {
	if ( $config['css'] ) {
		wp_enqueue_style( $css['handle'], $css['url'], $config['css_dep'], '1.0.0', 'all' );
	}
}
```

### Parameters

It accepts three parameters.

```php
<?php
$enqueue->getAssets( $name, $entryPoint, $config );
```

#### `$name` (`string`)

It is the `name` of `files` entry defined in your `wpackio.project.js`.

Given the following `files` in `wpackio.project.js`

```js
module.exports = {
	// ...
	// Files we need to compile, and where to put
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
		// If has more length, then multi-compiler
		{
			name: 'foo',
			entry: {
				main: ['./src/foo/foo.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
		// Another app just for showing react
		{
			name: 'reactapp',
			entry: {
				main: ['./src/reactapp/index.jsx'],
			},
		},
	],
	// ...
};
```

The value of `$name` could be `app`, `foo`, `reactapp`.

#### `$entryPoint` (`string`)

The key of the `entry` object as defined in `wpackio.project.js` file.

For the same config, if we choose `app` as `$name`, `$entryPoint` could be
`main` or `mobile`.

#### `$config` (`array`)

An associative array of additional configuration.

Here are the supported keys:

-   `js` (`boolean`) True if we are to include javascript files.
-   `css` (`boolean`) True if we are to include stylesheet files.
-   `js_dep` (`array`) Additional dependencies for the javascript assets.
-   `css_dep` (`array`) Additional dependencies for the stylesheet assets.
-   `in_footer` (`boolean`) Whether to print the assets in footer (for js only).
-   `media` (`string`) Media attribute for stylesheets (defaults `'all'`).

**defaults to**

```php
<?php
$config = [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'in_footer' => true,
	'media' => 'all',
];
```

> **NOTE**: The `identifier` property was removed from `$config`. We need complete
> control of the script `handle` to make sure common chunks, such as, `runtime`
> is enqueued only once.

### Return `array`

It returns an associative array with `js` and `css` asset handles and URLs
for ready consumption using `wp_enqueue` API. A return may look like this

```php
$return = [
	'js' => [
		[
			'handle' => 'wpackio_fooapp_path/to/foo.js_script',
			'url' => 'http://example.com/path/to/foo.js',
		],
		[
			'handle' => 'wpackio_fooapp_path/to/bar.js_script',
			'url' => 'http://example.com/path/to/bar.js',
		],
	],
	'css' => [
		[
			'handle' => 'wpackio_fooapp_path/to/foo.css_style',
			'url' => 'http://example.com/path/to/foo.css',
		],
		[
			'handle' => 'wpackio_fooapp_path/to/bar.css_style',
			'url' => 'http://example.com/path/to/bar.css',
		],
	],
];
```

It doesn't take care of internal dependencies by itself. The `register`
method does.

## Instance API: `register`

Register script handles with WordPress for an entrypoint inside a source.
It does not enqueue the assets, just calls `wp_register_*` on the asset.

This is useful if just registering script for things like gutenberg.

Usage and parameters are same as `getAssets`. It doesn't return anything.

### Example

```php
<?php
$enqueue = new \WPackio\Enqueue( 'appName', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->register( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'in_footer' => true,
	'media' => 'all',
] );
```

### Internal Dependencies

All the assets within an `$entryPoint` has internal dependency upon each other.

Let us consider the following `manifest.json` file generated by `@wpackio/scripts`.

```json
{
	"app/assets/image.png": "app/assets/asset-c7cf665262fc289aea5bbe16b4f9aa67.png",
	"main.css": "app/main.css",
	"main.css.map": "app/main.css.map",
	"main.js": "app/main.js",
	"main.js.map": "app/main.js.map",
	"mobile.js": "app/mobile.js",
	"mobile.js.map": "app/mobile.js.map",
	"runtime.js": "app/runtime.js",
	"runtime.js.map": "app/runtime.js.map",
	"wpackioEp": {
		"main": {
			"js": ["app/runtime.js", "app/vendor~main.js", "app/main.js"],
			"js.map": [
				"app/runtime.js.map",
				"app/vendor.js.map",
				"app/main.js.map"
			],
			"css": ["app/main.css"],
			"css.map": ["app/main.css.map"]
		},
		"mobile": {
			"js": ["app/runtime.js", "app/vendor~mobile.js", "app/mobile.js"],
			"js.map": [
				"app/runtime.js.map",
				"app/vendor.js.map",
				"app/mobile.js.map"
			]
		}
	}
}
```

Here the asset `app/main.js` of `main` `entryPoint` depends on both

1. `app/vendor~main.js`.
2. `app/runtime.js`.

So if we were to `enqueue` only `app/main.js` it will not work, it need the
two scripts in the page too.

Similarly for the asset `app/mobile.js`, of `mobile` `entryPoint`, we have
internal dependency of

1. `app/vendor~mobile.js`.
2. `app/runtime.js`.

Here `app/runtime.js` is a common dependency for both the entry-points. But
we should enqueue it only once.

To make sure WordPress properly enqueues the dependencies and doesn't come
up with duplicate scripts, `register` sets the scripts dependencies for you.

So if you do something like this

```php
$assets = $enqueue->register( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'in_footer' => true,
	'media' => 'all',
] );

wp_enqueue_script(
	array_pop(
		$assets['js']
	)['handle']
);
```

You can be assured that `app/vendor~main.js` and `app/runtime.js` will both
be enqueued.

There isn't any magic behind it. We just set internal dependencies during
call to [`wp_register_(script|style)`](https://github.com/swashata/wpackio-enqueue/blob/6411c4781ed58e62f746e01d081fd1838a212edf/inc/Enqueue.php#L146).

## Instance API: `enqueue`

Enqueue all the assets for an entry-point inside a source.

Usage and parameters are same as `getAssets`. It returns the same list of
`assets` as `getAssets`.

### Example

```php
<?php
$enqueue = new \WPackio\Enqueue( 'appName', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->enqueue( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'in_footer' => true,
	'media' => 'all',
] );
```

## Instance API: `getManifest`

Get an associative `array` representing the content of `manifest.json` of a file
entry.

### Usage

For the same `**wpackio.project.js**` as in `getAssets`, we can use this method
to retrieve the manifest file directly.

```php
<?php
$enqueue = new \WPackio\Enqueue( 'appName', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->getManifest( 'app' );

// Get the entry-points
var_dump( $assets['wpackioEp']['main'] );
var_dump( $assets['wpackioEp']['mobile'] );
```

### Parameters

It accepts only one parameter.

```php
$enqueue->getManifest( $name );
```

#### `$name` (`string`)

The name of the file entry as defined in `**wpackio.project.js**`. The `wpackio-scripts`
internally creates a directory of the same name inside `outputPath`.

`wpackio/enqueue` uses the same concept and looks for a file `manifest.json` inside
the same directory and returns the content as an associative array (using `json_decode`).

## Instance API: `getUrl`

Get public URL of an asset (script or style). It doesn't check whether the asset
actually exists or not. It just calculates the plugin/theme URL from `$outputPath`.

This is meant to be used to get URL from `manifest.json` files directly.

### Usage

```php
<?php
$enqueue = new \WPackio\Enqueue( 'appName', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$script = $enqueue->getUrl( 'app/main.js' );
$style = $enqueue->getUrl( 'app/main.css' );
```

### Parameters

It accepts only one parameter.

```php
$enqueue->getManifest( $asset );
```

#### `$asset` (`string`)

The relative path of the asset (with forward `/` as director separator) for which
URL is to be calculated.
