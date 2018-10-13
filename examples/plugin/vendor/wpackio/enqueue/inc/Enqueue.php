<?php
/**
 * Enqueue API for consuming assets generated through @wpackio/scripts.
 *
 * @author Swashata Ghosh <swashata4u@gmail.com>
 * @package WPackio\Enqueue
 */

namespace WPackio;

/**
 * The primary API class for enqueuing assets using WordPress APIs.
 */
class Enqueue {
	/**
	 * Output path relative to the root of this plugin/theme.
	 *
	 * @var string
	 */
	private $outputPath;

	/**
	 * Absolute path to plugin main file.
	 *
	 * @var string
	 */
	private $pluginPath;

	/**
	 * Whether this is a plugin or theme.
	 *
	 * @var string
	 */
	private $type = 'plugin';

	/**
	 * Plugin/Theme Version.
	 *
	 * @var string
	 */
	private $version = '';

	/**
	 * Manifest cache to prevent multiple reading from filesystem.
	 *
	 * @var array
	 */
	static private $manifestCache = [];

	/**
	 * Root absolute path to the output directory. With forward slash.
	 *
	 * @var string
	 */
	private $rootPath = '';

	/**
	 * Root URL to the output directory. With forward slash.
	 *
	 * @var string
	 */
	private $rootUrl = '';

	/**
	 * Application Name (userland).
	 *
	 * @var string
	 */
	private $appName = '';

	/**
	 * Create an instance of the Enqueue helper class.
	 *
	 * @throws \LogicException If $type is not plugin or theme.
	 *
	 * @param string         $appName Name of the application, same as wpackio.project.js.
	 * @param string         $outputPath Output path relative to the root of this plugin/theme, same as wpackio.project.js.
	 * @param string         $version Version of your plugin/theme, used to generate query URL.
	 * @param string         $type The type of enqueue, either 'plugin' or 'theme', same as wpackio.project.js.
	 * @param string|boolean $pluginPath If this is a plugin, then pass absolute path of the plugin main file, otherwise pass false.
	 */
	public function __construct( $appName, $outputPath, $version, $type = 'plugin', $pluginPath = false ) {
		$this->appName = $appName;
		$this->outputPath = $outputPath;
		$this->version = $version;
		if ( ! in_array( $type, [ 'plugin', 'theme' ] ) ) {
			throw new \LogicException( 'You can only enter "plugin" or "theme" as type.' );
		}
		$this->type = $type;
		$this->pluginPath = $pluginPath;

		// Set the root path and URL
		$filepath = \trailingslashit( \get_template_directory() ) . $this->outputPath . '/';
		$url = \trailingslashit( \get_template_directory_uri() ) . $this->outputPath . '/';
		if ( 'plugin' === $this->type ) {
			$filepath = \trailingslashit( dirname( $this->pluginPath ) ) . $this->outputPath . '/';
			$url = \trailingslashit( \plugins_url( $this->outputPath, $this->pluginPath ) );
		}
		$this->rootPath = $filepath;
		$this->rootUrl = $url;

		\add_action( 'wp_head', [ $this, 'printPublicPath' ], 1 );
		\add_action( 'admin_head', [ $this, 'printPublicPath' ], 1 );
	}

	/**
	 * Print a small JavaScript code to defined WordPress generated publicPath
	 * for this theme or plugin.
	 *
	 * The entrypoint from `@wpackio/scripts/lib/entrypoint.js` automatically
	 * uses this to define webpack publicPath in runtime.
	 *
	 * This the magic that happens behind the scene which makes code-splitting
	 * and dynamic imports possible.
	 */
	public function printPublicPath() {
		$publicPath = $this->getUrl( '' );
		$jsCode = 'window.__wpackIo' . $this->appName . $this->outputPath . '=\'' . esc_js( $publicPath ) . '\';';
		echo '<script type="text/javascript">/* wpack.io publicPath */' . $jsCode . '</script>';
	}

	/**
	 * Enqueue all the assets for an entrypoint inside a source.
	 *
	 * @throws \LogicException If manifest.json is not found in the directory.
	 *
	 * @see \WPackio\Enqueue::normalizeAssetConfig
	 *
	 * @param string $dir The name of the source directory.
	 * @param string $entryPoint Which entrypoint would you like to enqueue.
	 * @param array  $config Additional configuration.
	 * @return array Associative with `css` and `js`. Each of them are arrays
	 *               containing ['handle' => string, 'url' => string].
	 */
	public function enqueue( $dir, $entryPoint, $config ) {
		$config = $this->normalizeAssetConfig( $config );
		// Get asset urls
		$assets = $this->getAssets( $dir, $entryPoint, $config );
		// Enqueue all js
		$jses = $assets['js'];
		$csses = $assets['css'];

		foreach ( $jses as $js ) {
			if ( $config['js'] ) {
				\wp_enqueue_script( $js['handle'], $js['url'], $config['js_dep'], $this->version, $config['in_footer'] );
			}
		}

		foreach ( $csses as $css ) {
			if ( $config['css'] ) {
				wp_enqueue_style( $css['handle'], $css['url'], $config['css_dep'], $this->version, $config['media'] );
			}
		}

		return $assets;
	}

	/**
	 * Get handle and Url of all assets from the entrypoint.
	 *
	 * It doesn't enqueue anything for you, rather returns an associative array
	 * with handles and urls. You should use it to enqueue it on your own.
	 *
	 * @throws \LogicException If the entrypoint is not found in the manifest.
	 *
	 * @see \WPackio\Enqueue::normalizeAssetConfig
	 *
	 * @param string $dir The name of the source directory.
	 * @param string $entryPoint Which entrypoint would you like to enqueue.
	 * @param array  $config Additional configuration.
	 * @return array Associative with `css` and `js`. Each of them are arrays
	 *               containing ['handle' => string, 'url' => string].
	 */
	public function getAssets( $dir, $entryPoint, $config ) {
		$config = $this->normalizeAssetConfig( $config );
		// Get the manifest
		$manifest = $this->getManifest( $dir );
		// Get the entrypoint
		if ( ! isset( $manifest['wpackioEp'][ $entryPoint ] ) ) {
			throw new \LogicException( 'No entry point found in the manifest' );
		}
		$enqueue = $manifest['wpackioEp'][ $entryPoint ];

		// Set the identifier
		$identifier = $config['identifier'];
		if ( false === $identifier ) {
			$identifier = 'wpackIo' . ucfirst( $dir ) . ucfirst( $entryPoint );
		}

		$js_handles = [];
		$css_handles = [];

		// Figure out all javascript assets
		if ( $config['js'] && isset( $enqueue['js'] ) && count( (array) $enqueue['js'] ) ) {
			foreach ( $enqueue['js'] as $index => $js ) {
				$handle = $identifier . '_' . $index;
				$js_handles[] = [
					'handle' => $handle,
					'url' => $this->getUrl( $js ),
				];
			}
		}

		// Figure out all css assets
		if ( $config['css'] && isset( $enqueue['css'] ) && count( (array) $enqueue['css'] ) ) {
			foreach ( $enqueue['css'] as $index => $css ) {
				$handle = $identifier . '_' . $index . '_css';
				$css_handles[] = [
					'handle' => $handle,
					'url' => $this->getUrl( $css ),
				];
			}
		}

		// Return
		return [
			'css' => $css_handles,
			'js' => $js_handles,
		];
	}


	/**
	 * Normalizes the configuration array of assets.
	 *
	 * Here are the supported keys:
	 * `js` (`boolean`) True if we are to include javascripts.
	 * `css` (`boolean`) True if we are to include stylesheets.
	 * `js_dep` (`array`) Additional dependencies for the javascript assets.
	 * `css_dep` (`array`) Additional dependencies for the stylesheet assets.
	 * `identifier` (`string`|`false`) A custom prefix to generate the handle of assets.
	 * `in_footer` (`boolean`) Whether to print the assets in footer (for js only).
	 * `media` (`string`) Media attribute for stylesheets (defaults `'all'`).
	 *
	 * @param array $config Configuration array.
	 * @return array Normalized configuration with all the mentioned keys.
	 */
	public function normalizeAssetConfig( $config ) {
		return wp_parse_args(
			$config,
			[
				'js' => true,
				'css' => true,
				'js_dep' => [],
				'css_dep' => [],
				'identifier' => false,
				'in_footer' => true,
				'media' => 'all',
			]
		);
	}

	/**
	 * Get Url of an asset.
	 *
	 * @param string $asset Asset as recovered from manifest.json.
	 * @return string Complete URL.
	 */
	public function getUrl( $asset ) {
		return $this->rootUrl . $asset;
	}

	/**
	 * Get manifest from cache or from file.
	 *
	 * @throws \LogicException If manifest file is not found.
	 *
	 * @param string $dir The Source directory.
	 * @return array wpackio compatible manifest item.
	 */
	public function getManifest( $dir ) {
		// If already present in the cache, then return it
		if ( isset( self::$manifestCache[ $this->outputPath ][ $dir ] ) ) {
			return self::$manifestCache[ $this->outputPath ][ $dir ];
		}
		// It is not, so get the json file
		$filepath = $this->rootPath . $dir . '/manifest.json';

		// Check if it exists
		if ( ! file_exists( $filepath ) ) {
			throw new \LogicException( sprintf( 'Manifest %s does not exist.', $filepath ) );
		}
		$manifest = json_decode( file_get_contents( $filepath ), true );
		if ( $manifest === null || ! isset( $manifest['wpackioEp'] ) ) {
			throw new \LogicException( sprintf( 'Invalid manifest file at %s. Either it is not valid JSON or wpackioEp does not exist.', $filepath ) );
		}
		if ( ! isset( self::$manifestCache[ $this->outputPath ] ) ) {
			self::$manifestCache[ $this->outputPath ] = [];
		}
		self::$manifestCache[ $this->outputPath ][ $dir ] = $manifest;
		return self::$manifestCache[ $this->outputPath ][ $dir ];
	}
}
