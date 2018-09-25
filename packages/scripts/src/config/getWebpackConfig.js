import defaultProjectConfig from './project.config.default';

/**
 * Create the final webpack config
 *
 * @param {Object} projectConfig User's Project configuration.
 * @param {Boolean} isDev Whether in development mode.
 * @return {Object} Webpack config.
 */
const webpackConfig = (projectConfig, isDev = true) => {
	// Create a webpack config
	// It doesn't merge with user config though, just what the @wpw/scripts
	// would provide right out of the box, depending on project config.
};

export default webpackConfig;
