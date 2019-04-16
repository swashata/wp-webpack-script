import webpack from 'webpack';

/**
 * This file holds useful utility functions for file-loader
 */

/**
 * Get options for file-loader.
 *
 * This takes into account the appDir, development or production mode and
 * publicPath for file-loader usage from css files.
 *
 * @param appDir Application directory (corresponds to files[i].name).
 * @param isDev Whether this is for development or production build.
 * @param publicPath Whether to include publicPath.
 */
export function getFileLoaderOptions(
	appDir: string,
	isDev: boolean,
	publicPath: boolean
) {
	const fileLoaderOptions: { [x: string]: string | undefined } = {
		name: `[name]-[hash:8].[ext]`,
		outputPath: `${appDir}/assets/`,
	};
	if (publicPath) {
		// Here mention the public path relative to the css
		// file directory, but only during production mode
		// for development mode, it is still undefined
		fileLoaderOptions.publicPath = isDev ? undefined : `assets/`;
	}
	return fileLoaderOptions;
}

/**
 * Webpack module.rules[].issuer function to check if the issuer is
 * a style file (scss, sass, css).
 */
export function issuerForStyleFiles(location: string): boolean {
	return /\.(sa|sc|c)ss$/.test(location);
}

/**
 * Webpack module.rules[].issuer function to check if the issuer is NOT
 * a style file (scss, sass, css).
 */
export function issuerForNonStyleFiles(location: string): boolean {
	return !/\.(sa|sc|c)ss$/.test(location);
}

/**
 * Webpack module.rules[].issuer function to check if the issuer is NOT a
 * JavaScript (js,jsx) or TypeScript(ts,tsx) file.
 */
export function issuerForJsTsFiles(location: string): boolean {
	return /\.(j|t)sx?$/.test(location);
}

/**
 * Webpack module.rules[].issuer function to check if the issuer is a JavaScript
 * (js,jsx) or TypeScript(ts,tsx) file.
 */
export function issuerForNonJsTsFiles(location: string): boolean {
	return !/\.(j|t)sx?$/.test(location);
}

/**
 * Get file-loader with proper options set for javascript and style files.
 *
 * It makes sure that assets are put into proper directory and relativePath
 * works fine for css imports.
 *
 * @param appDir Application directory (corresponds to files[i].name).
 * @param isDev Whether this is for development or production build.
 * @param loader Name of the loader, defaults to `file-loader`.
 */
export function getFileLoaderForJsAndStyleAssets(
	appDir: string,
	isDev: boolean,
	loader: string = 'file-loader'
) {
	// create file rules
	// But use relativePath for style type resources like sass, scss or css
	// This is needed because we can't know the absolute publicPath
	// of CSS imported assets.
	const fileLoaderTest = /\.(woff|woff2|eot|ttf|otf|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/;

	const fileRulesNonStyle: webpack.RuleSetRule = {
		test: fileLoaderTest,
		use: [
			{
				loader,
				options: getFileLoaderOptions(appDir, isDev, false),
			},
		],
		issuer: issuerForNonStyleFiles,
	};
	const fileRulesStyle: webpack.RuleSetRule = {
		test: fileLoaderTest,
		use: [
			{
				loader,
				options: getFileLoaderOptions(appDir, isDev, true),
			},
		],
		issuer: issuerForStyleFiles,
	};

	return { fileRulesNonStyle, fileRulesStyle };
}
