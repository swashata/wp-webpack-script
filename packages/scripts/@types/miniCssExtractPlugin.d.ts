declare module 'mini-css-extract-plugin' {
	import * as webpack from 'webpack';
	export default class miniCssExtractPlugin extends webpack.Plugin {
		public static loader: string;
		constructor(config:{[x:string]:any})
	}
}
