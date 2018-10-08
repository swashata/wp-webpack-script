<?php
namespace WPackio;

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
	 * @param string $appName Name of the application, same as wpackio.project.js.
	 * @param string $outputPath Output path relative to the root of this plugin/theme, same as wpackio.project.js
	 * @param string $version Version of your plugin/theme, used to generate query URL.
	 * @param string $type The type of enqueue, either 'plugin' or 'theme', same as wpackio.project.js
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
			$url = \trailingslashit( \plugins_url(  $this->outputPath, $this->pluginPath) );
		}
		$this->rootPath = $filepath;
		$this->rootUrl = $url;

		\add_action( 'wp_head', [ $this, 'printPublicPath' ], 1 );
		\add_action( 'admin_head', [ $this, 'printPublicPath' ], 1 );
	}

	public function printPublicPath() {
		$publicPath = $this->getUrl( '' );
		$jsCode = 'window.wpackIo' . ucfirst( $this->appName ) . ucfirst( $this->outputPath ) . '=\'' . esc_js( $publicPath ) . '\';';
		echo '<script type="text/javascript">/* wpack.io publicPath */' . $jsCode . '</script>';
	}

	/**
	 * Enqueue all the assets for an entrypoint inside a source.
	 *
	 * @param string $dir The name of the source directory.
	 * @param string $entryPoint Which entrypoint would you like to enqueue.
	 * @param array $config Additional configuration.
	 * @return void
	 */
	public function enqueue( $dir, $entryPoint, $config ) {
		$config = wp_parse_args( $config, [
			'js' => true,
			'css' => true,
			'js_dep' => [],
			'css_dep' => [],
			'identifier' => false,
			'in_footer' => true,
			'media' => 'all',
		] );
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

		// Enqueue all js
		$js_handles = [];
		if ( $config['js'] && isset( $enqueue['js'] ) && count( (array) $enqueue['js'] ) ) {
			foreach ( $enqueue['js'] as $index => $js ) {
				$handle = $identifier . '_' . $index;
				wp_enqueue_script( $handle, $this->getUrl( $js ), $config['js_dep'], $this->version, $config['in_footer']);
				$js_handles[] = $handle;
			}
		}

		// Enqueue all CSS
		$css_handles = [];
		if ( $config['css'] && isset( $enqueue['css'] ) && count( (array) $enqueue['css'] ) ) {
			foreach ( $enqueue['css'] as $index => $css ) {
				$handle = $identifier . '_' . $index . '_css';
				wp_enqueue_style( $handle, $this->getUrl( $css ), $config['css_dep'], $this->version, $config['media'] );
				$css_handles[] = $handle;
			}
		}
	}

	/**
	 * Get Url of an asset.
	 *
	 * @param string $asset Asset as recovered from manifest.json
	 * @return string Complete URL.
	 */
	protected function getUrl( $asset ) {
		return $this->rootUrl . $asset;
	}

	/**
	 * Get manifest from cache or from file.
	 *
	 * @param string $dir The Source directory.
	 * @return array wpackio compatible manifest item.
	 */
	protected function getManifest( $dir ) {
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
