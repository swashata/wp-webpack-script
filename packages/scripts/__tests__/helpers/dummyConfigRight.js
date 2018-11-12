module.exports = {
	appName: 'helloWorld',
	files: [
		{
			entry: {
				foo: './src/index.js',
			},
			name: 'app',
		},
	],
	foo: 'bar',
	packageDirPath: 'package',
	packageFiles: ['**/*.js'],
};
