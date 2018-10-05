import { declare } from '@babel/helper-plugin-utils';
import { preset, PresetOptions } from './preset';
/**
 * Export a function to declare this preset.
 *
 * It takes options from userland and passes to @babel/preset-env
 */
module.exports = declare((api, opts) => {
	// Check if version is 7
	api.assertVersion(7);

	// Give back the babel config based on options
	return preset(opts as PresetOptions);
});
