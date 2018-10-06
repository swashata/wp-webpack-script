declare module 'webpack-dashboard/plugin' {
	import * as Tapable from 'tapable';
	export default class DashboardPlugin extends Tapable.Tapable{}
}

