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

// Get our dependency
require_once dirname( __FILE__ ) . '/inc/Enqueue.php';

// Do stuff through this plugin
class WPackioPluginInit {
	/**
	 * @var \WPackio\Enqueue
	 */
	public $enqueue;

	public function __construct() {
		// It is important that we init the Enqueue class right at the plugin/theme load time
		$this->enqueue = new \WPackio\Enqueue( 'wpackplugin', 'dist', '1.0.0', 'plugin', __FILE__ );
		// Enqueue a few of our entry points
		add_action( 'wp_enqueue_scripts', [ $this, 'plugin_enqueue' ] );
		// And heres a react app with shortcode
		add_shortcode( 'wpackio-reactapp', [ $this, 'reactapp' ] );
	}


	function plugin_enqueue() {
		$this->enqueue->enqueue( 'app', 'main', [] );
		$this->enqueue->enqueue( 'app', 'mobile', [] );
		$this->enqueue->enqueue( 'foo', 'main', [] );
	}

	function reactapp( $atts, $content = null ) {
		// Enqueue our react app scripts
		$this->enqueue->enqueue( 'reactapp', 'main', [] );

		// Print the entry point
		return '<div id="wpackio-reactapp"></div>';
	}
}


// Init
new WPackioPluginInit();
