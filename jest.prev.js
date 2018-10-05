module.exports = {
	verbose: true,
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: [
		'packages/**/*.js',
		'!**/node_modules/**',
		'!**/*.{spec|test}.js',
		'!**/lib/**',
		'!**/babel.config.js',
	],
};
