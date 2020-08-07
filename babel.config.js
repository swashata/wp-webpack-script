module.exports = api => {
	api.cache(true);
	const presets = [
		[
			'@babel/preset-env',
			{
				targets: {
					node: '12.18.3',
				},
				modules: 'cjs',
			},
		],
		'@babel/preset-typescript',
	];

	const plugins = [
		'@babel/proposal-class-properties',
		'@babel/proposal-object-rest-spread',
	];

	return {
		presets,
		plugins,
		ignore: [
			'./src/@types',
			'./src/__tests__',
			'./src/**/*.{spec|test}.{j|t}sx?',
		],
		sourceType: 'unambiguous',
		sourceMaps: 'inline',
	};
};
