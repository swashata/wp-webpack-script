// tslint:disable no-any

export interface PresetOptions {
	noDynamicImport?: boolean;
	noImportMeta?: boolean;
	noClassProperties?: boolean;
	noJsonStrings?: boolean;
	noRuntime?: boolean;
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

export type babelPresetConfiguration = {
	[x: string]: boolean | string | babelPresetConfiguration;
};
export type babelPreset = [string] | [string, babelPresetConfiguration];

export const preset = (opts: PresetOptions | null = {}) => {
	// from CRA
	// This is similar to how `env` works in Babel:
	// https://babeljs.io/docs/usage/babelrc/#env-option
	// We are not using `env` because it’s ignored in versions > babel-core@6.10.4:
	// https://github.com/babel/babel/issues/4539
	// https://github.com/facebook/create-react-app/issues/720
	// It’s also nice that we can enforce `NODE_ENV` being specified.
	const env = process.env.BABEL_ENV || process.env.NODE_ENV;
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
		[
			'@babel/preset-env',
			{ modules: env === 'test' ? 'commonjs' : false, ...presetEnv },
		],
	];
	// Add react if needed
	if (hasReact) {
		presets.push([
			'@babel/preset-react',
			{
				// Put development based on BABEL_ENV
				// Adds component stack to warning messages
				// Adds __self attribute to JSX which React will use for some warnings
				development: env !== 'production',
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
		noRuntime: [
			'@babel/plugin-transform-runtime',
			{
				corejs: false,
				helpers: true,
				regenerator: true,
				// We might wanna turn it on once node LTS has ESModules support
				useESModules: env !== 'test',
			},
		],
		noOptionalChaining: '@babel/plugin-proposal-optional-chaining',
	};
	// Add them, only if user hasn't explicitly disabled it
	Object.keys(wannabePlugins).forEach((pKey: string) => {
		if (noPlugins[pKey] !== true) {
			plugins.push(wannabePlugins[pKey]);
		}
	});

	// Necessary to include regardless of the environment because
	// in practice some other transforms (such as object-rest-spread)
	// don't work without it: https://github.com/babel/babel/issues/7215
	plugins.push([
		'@babel/plugin-transform-destructuring',
		{
			// Use loose mode for performance:
			// https://github.com/facebook/create-react-app/issues/5602
			loose: false,
			selectiveLoose: [
				'useState',
				'useEffect',
				'useContext',
				'useReducer',
				'useCallback',
				'useMemo',
				'useRef',
				'useImperativeHandle',
				'useLayoutEffect',
				'useDebugValue',
			],
		},
	]);

	// Return the preset and some of stage-3 plugins
	// We will remove them, once it becomes stage-4, i.e included in preset-env
	return {
		presets,
		plugins,
	};
};
