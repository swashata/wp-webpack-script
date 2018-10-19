# Use `wpackio/enqueue` API to consume assets

This is the PHP companion of @wpackio/scripts.

It gives you all the APIs you will need to properly consume assets generated from @wpackio/scripts from your WordPress plugins or themes.

## Installation

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

## Why call it early?

It is required that you create an instance of the class, before `wp_head` and
`admin_head` hooks are called. It is needed because `WPackio\Enqueue` hooks in
early to print a small javascript like this:

```html
<script type="text/javascript">
window.__wpackIoappNameoutputPath = 'https://example.com/wp-content/plugins/plugin-slug/dist/'
</script>
```

This is single-handedly responsible for making webpack [dynamic publicPath](https://webpack.js.org/guides/public-path/#on-the-fly) work.

## Creating Instance

While creating a class instance, you can pass in upto 5 parameters.

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

Get handle and Url of all assets from the entrypoint.
It doesn't enqueue anything for you, rather returns an associative array
with handles and urls. You should use it to enqueue it on your own.

### Usage

```php
<?php
$enqueue = new \WPackio\Enqueue( 'foo', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->getAssets( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'identifier' => false,
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
-   `identifier` (`string`|`false`) A custom prefix to generate the handle of assets.
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
	'identifier' => false,
	'in_footer' => true,
	'media' => 'all',
];
```

## Instance API: `enqueue`

Enqueue all the assets for an entrypoint inside a source.

Usage and parameters are same as `getAssets`. It doesn't return anything.

### Example

```php
<?php
$enqueue = new \WPackio\Enqueue( 'foo', 'dist', '1.0.0', 'plugin', PLUGIN_PATH );
$assets = $enqueue->enqueue( 'app', 'main', [
	'js' => true,
	'css' => true,
	'js_dep' => [],
	'css_dep' => [],
	'identifier' => false,
	'in_footer' => true,
	'media' => 'all',
] );
```
