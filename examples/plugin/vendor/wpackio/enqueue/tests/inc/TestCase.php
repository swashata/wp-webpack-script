<?php
/**
 * Primary class for all test cases.
 *
 * @package WPackio\Test
 */

namespace WPackioTest;

use Spatie\Snapshots\MatchesSnapshots;
use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;
use Brain\Monkey;

/**
 * An enhanced testcase framework with mockery
 * and brainmonkey integration.
 *
 * @link https://swas.io/blog/wordpress-plugin-unit-test-with-brainmonkey/
 */
class TestCase extends \PHPUnit\Framework\TestCase {
	use MatchesSnapshots;
	use MockeryPHPUnitIntegration;

	/**
	 * Setup which calls \WP_Mock setup
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();
		Monkey\setUp();
		// A few common passthrough
		// 1. WordPress i18n functions
		Monkey\Functions\when( '__' )
			->returnArg( 1 );
		Monkey\Functions\when( '_e' )
			->returnArg( 1 );
		Monkey\Functions\when( '_n' )
			->returnArg( 1 );
	}

	/**
	 * Teardown which calls \WP_Mock tearDown
	 *
	 * @return void
	 */
	public function tearDown() {
		Monkey\tearDown();
		parent::tearDown();
	}
}
