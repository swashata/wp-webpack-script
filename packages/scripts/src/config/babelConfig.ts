import {
	babelPreset,
	PresetOptions,
} from '@wpackio/babel-preset-base/lib/preset';

/**
 * Get default options for @wpackio/babel-preset-base considering whether
 * project has react and whether it is in development mode.
 *
 * @param hasReact Whether to include react jsx transform.
 * @param isDev Whether in development mode or production mode.
 */
export function getDefaultBabelPresetOptions(
	hasReact: boolean,
	isDev: boolean = false
): PresetOptions {
	const defaultBabelOptions: PresetOptions = {
		hasReact,
	};

	// Push targets to babel-preset-env if this is dev
	// We target only the latest chrome and firefox for
	// greater speed
	if (isDev) {
		defaultBabelOptions.presetEnv = {
			targets: {
				chrome: '69',
				firefox: '62',
				edge: '17',
			},
		};
	}

	return defaultBabelOptions;
}

/**
 * Get final options for @wpackio/babel-preset-base, combining both
 * system default and user defined value.
 *
 * @param defaults Default options for @wpackio/babel-preset-base.
 * @param options User defined options for @wpackio/babel-preset-base.
 */
export function overrideBabelPresetOptions(
	defaults: PresetOptions,
	options: PresetOptions | undefined
): PresetOptions {
	// If options is not undefined or null, then spread over it
	if (options !== undefined) {
		return { ...defaults, ...options };
	}
	return defaults;
}

// We support only flow and typescript out of the box
// with babel
export type typelang = 'flow' | 'typescript';

/**
 * Get Babel Presets for compiling JavaScript or TypeScript files.
 *
 * @param presetOptions Options for `@wpackio/base`.
 * @param typeChecker Whether to include preset for 'flow' or 'typescript'. Leave `undefined` to ignore both.
 */
export function getBabelPresets(
	presetOptions: PresetOptions,
	typeChecker?: typelang
): babelPreset[] {
	const babelConfig: babelPreset[] = [['@wpackio/base', presetOptions]];

	// If we have flow then push the preset
	if (typeChecker === 'flow') {
		babelConfig.push(['@babel/preset-flow']);
	}
	// If we have typescript, then push the preset
	if (typeChecker === 'typescript') {
		babelConfig.push(['@babel/preset-typescript']);
	}
	return babelConfig;
}
