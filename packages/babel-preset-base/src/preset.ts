// tslint:disable no-any

export interface PresetOptions {
	noDynamicImport?: boolean;
	noImportMeta?: boolean;
	noClassProperties?: boolean;
	noJsonStrings?: boolean;
	presetEnv?: {};
	[x: string]: any;
}

interface BabelPluginConfig {
	[x: string]: any;
}

type singleBabelPlugin = string | [string, BabelPluginConfig];

type babelPlugin = singleBabelPlugin[];

interface PossiblePlugins {
	[x: string]: singleBabelPlugin;
}

export const preset = (opts: PresetOptions | null = {}) => {
	// Extract this preset specific options and pass the rest to @babel/preset-env
	const {
		// noDynamicImport = false,
		// noImportMeta = false,
		// noClassProperties = false,
		// noJsonStrings = false,
		presetEnv = {},
		...noPlugins
	} = opts || {};

	// Create the presets
	const presets = [['@babel/preset-env', { modules: false, ...presetEnv }]];

	// Create the plugins
	const plugins: babelPlugin = [];
	const wannabePlugins: PossiblePlugins = {
		noDynamicImport: '@babel/plugin-syntax-dynamic-import',
		noImportMeta: '@babel/plugin-syntax-import-meta',
		noClassProperties: [
			'@babel/plugin-proposal-class-properties',
			{ loose: false },
		],
		noJsonStrings: '@babel/plugin-proposal-json-strings',
	};
	// Add them, only if user hasn't explicitly disabled it
	if (noPlugins) {
		Object.keys(wannabePlugins).forEach((pKey: string) => {
			if (noPlugins[pKey] !== true) {
				plugins.push(wannabePlugins[pKey]);
			}
		});
	}

	// Return the preset and some of stage-3 plugins
	// We will remove them, once it becomes stage-4, i.e included in preset-env
	return {
		presets,
		plugins,
	};
};
