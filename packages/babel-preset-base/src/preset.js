export default (opts = {}) => {
	// Extract this preset specific options and pass the rest to @babel/preset-env
	const {
		noDynamicImport = false,
		noImportMeta = false,
		noClassProperties = false,
		noJsonStrings = false,
		...envOptions
	} = opts || {};

	// Create the presets
	const presets = [['@babel/preset-env', { ...envOptions }]];

	// Create the plugins
	const plugins = [];
	// Add them, only if user hasn't explicitly disabled it
	if (!noDynamicImport) {
		plugins.push('@babel/plugin-syntax-dynamic-import');
	}
	if (!noImportMeta) {
		plugins.push('@babel/plugin-syntax-import-meta');
	}
	if (!noClassProperties) {
		plugins.push([
			'@babel/plugin-proposal-class-properties',
			{ loose: false },
		]);
	}
	if (!noJsonStrings) {
		plugins.push('@babel/plugin-proposal-json-strings');
	}

	// Return the preset and some of stage-3 plugins
	// We will remove them, once it becomes stage-4, i.e included in preset-env
	return {
		presets,
		plugins,
	};
};
