module.exports = api => {
	api.cache(true);
	const presets = [
		[
			'@babel/preset-env',
			{
				targets: {
					node: '8.9.0',
				},
				modules: 'cjs',
			},
			'flow',
		],
	];

	return {
		presets,
	};
};
