/**
 * Get Webpack compatibly `entry` object.
 *
 * @param {String} file File object from projectConfig
 * @param {Boolean} isDev Whether in development mode.
 *
 * @returns {Object} Entry for directly using in webpack.
 */
export const getEntry = (file, isDev) => {
	// First destructure away the stuff we need
	const { name, entry } = file;
	// We intend to pass the entry directly to webpack,
	// but, we need to add the hot-middleware client to the entry
	// else it will simply not work
	const normalizedEntry = {};
	// Loop over all user defined entries and add to the normalizedEntry
	Object.keys(entry).forEach(key => {
		normalizedEntry[key] = Array.isArray(entry[key])
			? entry[key]
			: [entry[key]];
	});
	// Now, if in dev mode, then add the hot middleware client
	if (isDev) {
		// Custom overlay and it's styling
		// Custom style
		const overlayStyles = {
			zIndex: 999999999,
			fontSize: '14px',
			fontFamily:
				'Dank Mono, Operator Mono SSm, Operator Mono, Menlo, Consolas, monospace',
			padding: '32px 16px',
		};
		// Define the hot client string
		// Here we need
		// 1. dynamicPublicPath - Because we intend to use __webpack_public_path__
		// 2. overlay and overlayStypes - To enable overlay on errors, we don't need warnings here
		// 3. path - The output path, I am not sure if we need this, so let's skip
		// 4. name - Because it could be multicompiler
		const webpackHotClient = `webpack-hot-middleware/client?name=${name}&dynamicPublicPath=true&overlay=true&reload=true&overlayStyles=${encodeURIComponent(
			JSON.stringify(overlayStyles)
		)}`;
		// Now add to each of the entries
		// We don't know if user want to specifically disable for some, but let's
		// not think ahead of ourselves
		Object.keys(normalizedEntry).forEach(key => {
			normalizedEntry[key].push(webpackHotClient);
		});
	}
	return normalizedEntry;
};

export const getOutput = (config, file, isDev) => {
	// Now use the config to create a output
	// Destucture stuff we need from config
	const { type, slug, host, port } = config;
	// and file
	const { path, filename } = file;
	// Assuming it is production
	const output = {
		path,
		filename,
		// leave blank because we would handle with free variable in runtime
		publicPath: '',
	};
	// Add the publicPath if it is in devMode
	if (isDev) {
		const contentDir = `${type}s`;
		output.publicPath = `//${host ||
			'localhost'}:${port}/wp-content/${contentDir}/${slug}/`;
	}

	return output;
};

const getEntryAndOutput = (config, file, isDev = true) =>
	// Create a webpack understandable entry point
	({
		entry: getEntry(file, isDev),
		output: getOutput(config, file, isDev),
	});

export default getEntryAndOutput;
