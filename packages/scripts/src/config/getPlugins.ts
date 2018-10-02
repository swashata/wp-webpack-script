import cleanWebpackPlugin from 'clean-webpack-plugin';
import miniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

interface BannerConfig {
	name: string;
	author: string;
	version: string;
	link: string;
	license: string;
	copyrightText: string;
	credit: boolean;
}

interface GetPluginsConfig {
	isDev: boolean;
	bannerConfig: BannerConfig;
}
/**
 * Get WebPack plugins, depending on development or production
 */
export function getPlugins({
	isDev,
	bannerConfig,
}: GetPluginsConfig): webpack.Plugin[] {
	// Figure the NODE_ENV string
	const ENV: string = JSON.stringify(isDev ? 'production' : 'development');
	// Add common plugins
	const plugins: webpack.Plugin[] = [
		// Define env
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': ENV,
			'process.env.BABEL_ENV': ENV,
		}),
		// Clean dist directory
		new cleanWebpackPlugin(['dist']),
		// Initiate mini css extract
		new miniCssExtractPlugin({
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
}
