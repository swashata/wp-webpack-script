export default (opts = {}) => {
	// Extract @babel/preset-react options and base options
	const { presetReact = {} } = opts;
	// Create the presets
	const presets = [
		[
			'@babel/preset-react',
			{
				// Put development based on BABEL_ENV
				development: process.env.BABEL_ENV !== 'production',
				// But spread later, so that user can override it
				...presetReact,
			},
		],
	];
	// We don't need other plugins
	// We could go for react-hot-loader, but it seems to me a scope for
	// @wpackio/scripts instead.
	return { presets };
};
