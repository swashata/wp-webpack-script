declare module 'extract-css-chunks-webpack-plugin' {
	import * as webpack from 'webpack';
	export default class ExtractCssChunksWebpackPlugin extends webpack.Plugin {
		public static loader: string;
		constructor(config: { [x: string]: any });
	}
}
