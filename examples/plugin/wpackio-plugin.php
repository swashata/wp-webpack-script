<?php
/**
 * WPack.io Sample Plugin Development
 *
 * @package     Wpackio
 * @author      Swashata Ghosh
 * @copyright   2018 Swashata Ghosh
 * @license     GPL-2.0+
 *
 * @wordpress-plugin
 * Plugin Name: WPack.io Sample Plugin Development
 * Plugin URI:  https://wpack.io
 * Description: Test plugin development using wpackio-scripts
 * Version:     1.0.0
 * Author:      Swashata Ghosh
 * Author URI:  https://swas.io
 * Text Domain: wpack-io
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Create an admin page
add_action( 'wp_enqueue_scripts', 'wpackio_plugin_enqueue' );
require_once dirname( __FILE__ ) . '/inc/Enqueue.php';
$enqueue = new \WPackio\Enqueue( 'wpackplugin', 'dist', '1.0.0', 'plugin', __FILE__ );

function wpackio_plugin_enqueue() {
	global $enqueue;
	$enqueue->enqueue( 'app', 'main', [] );
	$enqueue->enqueue( 'foo', 'main', [] );
}
