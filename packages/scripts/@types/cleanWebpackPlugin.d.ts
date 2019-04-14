declare module 'clean-webpack-plugin' {
	import * as webpack from 'webpack';
	export default class cleanWebpackPlugin extends webpack.Plugin {
		constructor(options: {[x:string]: boolean|string|string[]})
	}
}
