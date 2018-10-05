// Export the mockedApi for testing
export const mockedApi = {
	assertVersion: jest.fn(),
};
// Export the named function we need
type assertversion = (v: number) => boolean;
interface Api {
	assertVersion: assertversion;
}
// An object with string, array, or object members
type Options = { [x: string]: string | Options[] | Options };
type declareHandler = (api: Api, opts: Options, dirname: string) => {};
export const declare = (builder: declareHandler) => (
	api: Api,
	options: Options,
	dirname: string
) => {
	// override api with jest mock
	return builder(mockedApi as Api, options || {}, dirname);
};
