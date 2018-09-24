export default (opts = {}) => {
	// Extract @babel/preset-react options and base options
	const { presetReact = {}, presetBase = {} } = opts;
	// Create the presets
	const presets = [
		['@wpw/base', { ...presetBase }],
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
	// @wpw/scripts instead.
	return { presets };
};
