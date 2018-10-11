declare module 'react-dev-utils/WatchMissingNodeModulesPlugin' {
	import * as Tapable from 'tapable';
	export default class WatchMissingNodeModulesPlugin extends Tapable.Tapable{
		constructor(path:string)
	}
}

