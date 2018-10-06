// Export the mockedApi for testing
export const mockedApi = {
	assertVersion: jest.fn(),
};
// Export the named function we need
export type assertversion = (v: number) => boolean;
export interface Api {
	assertVersion: assertversion;
}
// An object with string, array, or object members
// tslint:disable: no-any
export type Options = { [x: string]: string | Options[] | Options };
export type declareHandler = (api: Api, opts: Options, dirname: string) => any;
export const declare = (builder: declareHandler) => (
	api: Api,
	options: Options,
	dirname: string
) => {
	// override api with jest mock
	return builder(mockedApi as Api, options || {}, dirname);
};
