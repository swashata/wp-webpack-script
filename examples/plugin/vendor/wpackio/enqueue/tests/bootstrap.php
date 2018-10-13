<?php
/**
 * The following snippets uses `PLUGIN` to prefix
 * the constants and class names. You should replace
 * it with something that matches your plugin name.
 *
 * @package WPackio\Tests
 */

// define test environment
// define fake ABSPATH
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', sys_get_temp_dir() );
}

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/inc/TestCase.php';
