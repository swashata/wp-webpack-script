<?php

class Wpackio_Plugin_Init {
	/**
	 * @var \WPackio\Enqueue
	 */
	public $enqueue;

	public function __construct() {
		// It is important that we init the Enqueue class right at the plugin/theme load time
		$this->enqueue = new \WPackio\Enqueue( 'wpackplugin', 'dist', '1.0.0', 'plugin', WPACKIO_SAMPLE_PLUGIN );
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
