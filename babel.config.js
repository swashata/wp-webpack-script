module.exports = api => {
	api.cache(true);
	const presets = [
		[
			'@babel/preset-env',
			{
				targets: {
					node: '8.12',
				},
				modules: 'commonjs',
			},
		],
	];

	return {
		presets,
	};
};
