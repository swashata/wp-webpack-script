module.exports = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
		'!src/@types/**',
		'!**/node_modules/**',
		'!**/*.{spec|test}.ts',
		'!**/lib/**',
		'!**/babel.config.js',
	],
	testMatch: ['**/?(*.)+(spec|test).(j|t)s?(x)'],
};
