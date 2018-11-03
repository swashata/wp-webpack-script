This is an example plugin to showcase working of `@wpackio/scripts`. It has
the following features.

1. Using `style.css` just as a dummy. We don't enqueue it.
2. Single entry point with `src/theme/main.js`.

## Getting Started

1. Clone this repository.
2. Make sure you have [docker](https://www.docker.com/) and [composer](https://getcomposer.org/) installed on your machine.
3. Install all composer dependency (just `wpackio/enqueue` in our case).

    ```bash
    composer install
    ```

4. Run the following command from this directory `examples/plugin`.

    ```bash
    docker-compose up -d && docker-compose logs -f wordpress
    ```

    Wait until the build is complete. Then press <kbd>ctrl</kbd> + <kbd>c</kbd>.

    Now run

    ```bash
    yarn
    yarn start
    ```

    Or if you are using npm

    ```bash
    npm i
    npm start
    ```

    This will open up the development server within your network LAN Ip address.

    Note that due to how `file:` dependency works with `npm`, it might throw some
    error. We recommend using `yarn`, until the issue is resolved. This is just
    for checking out this demo. In your own project, both `npm` and `yarn` will
    work fine.

5. Now log into your WordPress dashboard with:
   a. Username: `root`
   b. Password: `root`
6. Activate `WPackio Sample Theme` theme.
7. Check the homepage and check your browser's console.

> It is not a requirement to use docker for `@wpackio/scripts`. It is just
> required for this example. You can very well spin up any local server you
> are comfortable with.

## How are we enqueuing?

For simplicity, we are creating a global variable.

```php
<?php
$wpackio_sample_theme_enqueue = new \WPackio\Enqueue( 'wpackiotheme', 'dist', '1.0.0', 'theme' );
```

Now we hook into `wp_enqueue_scripts`.

```php
<?php
/**
 * Enqueue scripts and styles.
 */
function wpackio_theme_scripts() {
	// We may not need to do it if using through wpackio/enqueue
	// wp_enqueue_style( 'wpackio-theme-style', get_stylesheet_uri() );
	// Enqueue assets through wpackio/enqueue
	/**
	 * @var \WPackio\Enqueue
	 */
	global $wpackio_sample_theme_enqueue;
	$wpackio_sample_theme_enqueue->enqueue( 'theme', 'main', [] );
}
add_action( 'wp_enqueue_scripts', 'wpackio_theme_scripts' );
```

And that takes care of our enqueue.

Note that it is important to instantiate the enqueue variable during theme entry-point.
Hence we have the code in our `functions.php` file.

## Checking some HMR

Now go ahead and edit the content in main.js and main.scss.
