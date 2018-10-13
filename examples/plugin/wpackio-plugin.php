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

// Define plugin path
define( 'WPACKIO_SAMPLE_PLUGIN', __FILE__ );

// Get our autoloader from composer
require_once __DIR__ . '/vendor/autoload.php';

// Get our own plugin classes, we could (and **SHOULD**) use autoload here too, but let's skip it
require_once __DIR__ . '/inc/class-wpackio-plugin-init.php';

// Do stuff through this plugin
// Init
new Wpackio_Plugin_Init();
