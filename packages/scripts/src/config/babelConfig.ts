import {
	babelPreset,
	PresetOptions,
} from '@wpackio/babel-preset-base/lib/preset';

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
export function getBabelPresetOptions(
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
 * Get Babel configuration for compiling JavaScript or TypeScript files.
 *
 * @param babelOptions Default babel options.
 * @param userOptions User defined babel options as read from wpackio.config.js file.
 * @param typeChecker Whether to include preset for 'flow' or 'typescript'. Leave `undefined` to ignore both.
 */
export function getBabelConfig(
	babelOptions: PresetOptions,
	userOptions: PresetOptions | undefined,
	typeChecker?: typelang
): babelPreset[] {
	const babelConfig: babelPreset[] = [
		['@wpackio/base', getBabelPresetOptions(babelOptions, userOptions)],
	];

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
