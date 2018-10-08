/* eslint-disable camelcase, no-underscore-dangle, no-undef */
if (process.env.NODE_ENV === 'production') {
	// We set dynamic publicPath only for production
	// In development, it is always handled by the internals
	// As in the webpack config.
	__webpack_public_path__ = window.wpackIoDist;
}
