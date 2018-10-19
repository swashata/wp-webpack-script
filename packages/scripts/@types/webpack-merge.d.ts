declare module 'webpack-merge' {
	import * as webpack from 'webpack';
	interface customizeArray {
		(a:any[], b:any[], key:string):any[]
	}
	interface customizeObject {
		(a:Object, b:Object, key:string):Object
	}
	interface merge {
		// Main callable function interface
		(...configs: webpack.Configuration[]):webpack.Configuration;
		(configs:webpack.Configuration[]):webpack.Configuration;
	}
	function merge(...configs: webpack.Configuration[]):webpack.Configuration;
	function merge(configs:webpack.Configuration[]):webpack.Configuration;
	function merge(customizer:{customizeArray:customizeArray, customizeObject:customizeObject}):merge;
	namespace merge {
		function smart(...configs: webpack.Configuration[]):webpack.Configuration;
	}
	export = merge;
}
