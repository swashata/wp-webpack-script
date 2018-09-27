// @flow
import webpack from 'webpack';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

type getPluginsParam = {
	isDev: boolean,
	bannerConfig: {},
};
/**
 * Get WebPack plugins.
 *
 * @param {Boolean} isDev Whether in development mode.
 * @return {Array} Array of WebPack plugins.
 */
const getPlugins = ({ isDev = true, bannerConfig = {} }: getPluginsParam) => {
	// Figure the NODE_ENV string
	const ENV = JSON.stringify(isDev ? 'production' : 'development');
	// Add common plugins
	const plugins = [
		// Define env
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': ENV,
			'process.env.BABEL_ENV': ENV,
		}),
		// Clean dist directory
		new CleanWebpackPlugin(['dist']),
		// Initiate mini css extract
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	];
	// Add development specific plugins
	if (isDev) {
		plugins.push(
			// Hot Module Replacement
			new webpack.HotModuleReplacementPlugin()
		);
	} else {
		// Add Production specific plugins
		plugins.push(
			// Banner plugin
			new webpack.BannerPlugin({
				entryOnly: false,
				raw: false,
				include: /\.(js|jsx|css)$/,
				banner: `
${bannerConfig.name}

@author ${bannerConfig.author}
@version ${bannerConfig.version}
@link ${bannerConfig.link}
@license ${bannerConfig.license}

Copyright (c) ${new Date().getFullYear()} ${bannerConfig.author}

${bannerConfig.copyrightText}

${
					bannerConfig.credit
						? 'Compiled with the help of https://wpack.io\nA zero setup Webpack Bundler Script for WordPress'
						: ''
				}
`,
			})
		);
	}
	// Return it
	return plugins;
};

export default getPlugins;
