declare module '@babel/helper-plugin-utils' {
	// Help needed
	// I have written all these under `__mocks__/@babel/helper-plugin-utils.ts`
	// Is there any way to reuse it?
	namespace helper {
		type assertversion = (v: number) => boolean;
		interface Api {
			assertVersion: assertversion;
		}
		interface Options {
			[x: string]: string | Options[] | Options;
		}
		type declareHandler = (api: Api, opts: Options, dirname?: string) => any;
		function declare(
			builder: declareHandler
		): (api: Api, options: Options, dirname?: string) => any;
	}
	export = helper;
}
