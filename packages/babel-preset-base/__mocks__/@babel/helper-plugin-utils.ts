// Export the mockedApi for testing
export const mockedApi = {
	assertVersion: jest.fn(),
};
// Export the named function we need
export const declare = builder => (api, options, dirname) => {
	// override api with jest mock
	return builder(mockedApi, options || {}, dirname);
};
