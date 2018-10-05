declare module '@babel/helper-plugin-utils' {
	namespace helper {
		type assertversion = (v:number) => boolean;
		interface Api {
			assertVersion:assertversion;
		}
		type declareHandler = (api:Api, opts: any) => any;
		function declare(callback:declareHandler):Function;
	}
	export = helper;
}
