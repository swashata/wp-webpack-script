/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global __webpack_public_path__ */
// eslint-disable-next-line spaced-comment
///<reference types="webpack-env" />
// We expect __webpack_public_path__ to be present, thanks to webpack
declare const __WPACKIO__: { appName: string; outputPath: string } | undefined;

// We are not using DOM in the typescript library, so let's just hack our way
// through window
// tslint:disable-next-line:no-any
declare const window: { [x: string]: any };

// We would override __webpack_public_path__ only if __WPACKIO__ webpack plugin is set
if (__WPACKIO__) {
	const path = (__WPACKIO__.appName + __WPACKIO__.outputPath)
		.toLowerCase()
		.replace(/[^a-z0-9_\-]/g, '');
	// eslint-disable-next-line no-global-assign
	__webpack_public_path__ = window[`__wpackIo${path}`] as string;
}
