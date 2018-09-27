import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const getModule = ({ hasReact = true, hasSass = true, isDev = true }) => {
	// create the babel rules
	const babelRules = {
		test: /\.m?jsx?$/,
		use: ['babel-loader'],
		exclude: /(node_modules|bower_components)/,
		options: {
			presets: ['@wpackio/base'],
		},
	};
	if (hasReact) {
		babelRules.presets.push('@wpackio/react');
	}
	// Create style rules
	const styleRules = {
		test: /\.css$/,
		use: [
			isDev
				? 'style-loader'
				: {
						loader: MiniCssExtractPlugin.loader,
						options: {
							sourceMap: true,
						},
				  },
			{
				loader: 'css-loader',
				options: {
					importLoaders: 1,
					sourceMap: true,
				},
			},
			'postcss-loader',
		],
	};
	// If we have sass, then add the stuff
	if (hasSass) {
		styleRules.test = /\.(sa|sc|c)ss$/;
		styleRules.use.push({
			loader: 'sass-loader',
			options: {
				sourceMap: true,
			},
		});
	}
	// create file rules
	const fileRules = {
		test: /\.(woff|woff2|eot|ttf|otf|svg|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
		use: [
			{
				loader: 'file-loader',
				options: {
					name: 'asset-[hash].[ext]',
					outputPath: 'assets/',
				},
			},
		],
	};

	return {
		rules: [babelRules, styleRules, fileRules],
	};
};

export default getModule;
