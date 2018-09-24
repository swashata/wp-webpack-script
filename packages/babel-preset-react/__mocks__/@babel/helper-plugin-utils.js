const mockedApi = {
	assertVersion: jest.fn(),
};
// Export the named function we need
export const declare = builder => (api, options, dirname) => {
	// override api with jest mock
	/* eslint-disable no-param-reassign */
	api = mockedApi;
	return builder(api, options || {}, dirname);
};
// Export the mockedApi for testing
export default mockedApi;
