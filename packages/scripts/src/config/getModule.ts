import miniCssExtractPlugin from 'mini-css-extract-plugin';
import webpack from 'webpack';

interface ModuleParam {
	hasReact: boolean;
	hasSass: boolean;
	isDev: boolean;
}

interface Module {
	rules: webpack.RuleSetRule[];
}

export function getModule({
	hasReact = true,
	hasSass = true,
	isDev = true,
}: ModuleParam): Module {
	// create the babel rules for es6+ code
	const jsPresets: string[] = ['@wpackio/base'];
	if (hasReact) {
		jsPresets.push('@wpackio/react');
	}
	const jsRules: webpack.RuleSetRule = {
		test: /\.m?jsx?$/,
		use: ['babel-loader'],
		exclude: /(node_modules|bower_components)/,
		options: {
			presets: jsPresets,
		},
	};

	// create the babel rules for typescript code
	const tsPresets: string[] = ['@wpackio/base'];
	if (hasReact) {
		tsPresets.push('@wpackio/react');
	}
	tsPresets.push('@babel/preset-typescript');
	const tsRules: webpack.RuleSetRule = {
		test: /\.tsx?$/,
		use: ['babel-loader'],
		exclude: /(node_modules)/,
		options: {
			presets: tsPresets,
			plugins: [
				'@babel/proposal-class-properties',
				'@babel/proposal-object-rest-spread',
			],
		},
	};
	// Create style rules
	const styleRules: webpack.RuleSetRule = {
		test: /\.css$/,
		use: [
			isDev
				? 'style-loader'
				: {
						loader: miniCssExtractPlugin.loader,
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
	if (hasSass && styleRules.use != null && Array.isArray(styleRules.use)) {
		styleRules.test = /\.(sa|sc|c)ss$/;
		styleRules.use.push({
			loader: 'sass-loader',
			options: {
				sourceMap: true,
			},
		});
	}
	// create file rules
	const fileRules: webpack.RuleSetRule = {
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
		rules: [jsRules, tsRules, styleRules, fileRules],
	};
}
