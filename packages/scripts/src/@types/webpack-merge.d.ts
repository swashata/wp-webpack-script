declare module 'webpack-merge' {
	import * as webpack from 'webpack';
	function merge(...configs: webpack.Configuration[]):webpack.Configuration;
	namespace merge {
		function smart(...configs: webpack.Configuration[]):webpack.Configuration;
	}
	export = merge;
}
