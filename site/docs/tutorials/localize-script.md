---
title: Localize scripts enqueued with PHP API
order: 2
shortTitle: Localize Scripts
---

To enqueue with the
[`wpackio/enqueue`](https://wpack.io/guides/using-wpackio-enqueue/) composer
package, you need to do something like this.

```php
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

Now if you store the return value of `enqueue`, (`$assets` in the example), you
will get the handle and URL of all the assets. Like

```php
[
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

Now the last item of each `js` and `css` arrays is the final handle where you
would want to attach `localize_script`. So something like

```php
$entry_point = array_pop( $assets['js'] );
wp_localize_script( $entry_point['handle'], 'objectName', $localization );
```

The same concept is true for
[`getAssets`](https://wpack.io/apis/php-api/#instance-api-getassets),
[`enqueue`](https://wpack.io/apis/php-api/#instance-api-enqueue) and
[`register`](https://wpack.io/apis/php-api/#instance-api-register) methods.
