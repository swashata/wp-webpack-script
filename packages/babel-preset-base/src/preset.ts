// tslint:disable no-any

export interface PresetOptions {
	noDynamicImport?: boolean;
	noImportMeta?: boolean;
	noClassProperties?: boolean;
	noJsonStrings?: boolean;
	hasReact?: boolean;
	presetEnv?: {};
	presetReact?: {};
	[x: string]: any;
}

export interface BabelPluginConfig {
	[x: string]: any;
}

export type singleBabelPlugin = string | [string, BabelPluginConfig];

export interface PossiblePlugins {
	[x: string]: singleBabelPlugin;
}

// eslint-disable-next-line @typescript-eslint/prefer-interface
export type babelPresetConfiguration = {
	[x: string]: boolean | string | babelPresetConfiguration;
};
export type babelPreset = [string] | [string, babelPresetConfiguration];

export const preset = (opts: PresetOptions | null = {}) => {
	// Extract this preset specific options and pass the rest to @babel/preset-env
	const {
		presetEnv = {},
		presetReact = {},
		hasReact = true,
		// Put everything else inside noPlugins, which we will use later
		// to put or cancel out stage-3 plugins.
		// noDynamicImport = false,
		// noImportMeta = false,
		// noClassProperties = false,
		// noJsonStrings = false,
		...noPlugins
	} = opts || {};

	// Create the presets
	const presets: babelPreset[] = [
		['@babel/preset-env', { modules: false, ...presetEnv }],
	];
	// Add react if needed
	if (hasReact) {
		presets.push([
			'@babel/preset-react',
			{
				// Put development based on BABEL_ENV
				// Adds component stack to warning messages
				// Adds __self attribute to JSX which React will use for some warnings
				development: process.env.BABEL_ENV !== 'production',
				// Will use the native built-in instead of trying to polyfill
				// behavior for any plugins that require one.
				useBuiltIns: true,
				// But spread later, so that user can override it
				...presetReact,
			},
		]);
	}

	// Create the plugins
	const plugins: singleBabelPlugin[] = [];
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
	Object.keys(wannabePlugins).forEach((pKey: string) => {
		if (noPlugins[pKey] !== true) {
			plugins.push(wannabePlugins[pKey]);
		}
	});

	// We include @babel/plugin-transform-runtime by default in order to
	// properly transform e.g. async/await
	plugins.push([
		'@babel/plugin-transform-runtime',
		{
			corejs: false,
			helpers: true,
			regenerator: true,
			useESModules: true,
		},
	]);

	// Return the preset and some of stage-3 plugins
	// We will remove them, once it becomes stage-4, i.e included in preset-env
	return {
		presets,
		plugins,
	};
};
