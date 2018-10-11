// We expect __webpack_public_path__ to be present, thanks to webpack
declare let __webpack_public_path__: string | undefined;
declare const __WPACKIO__: { appName: string; outputPath: string } | undefined;

// We are not using DOM in the typescript library, so let's just hack our way
// through window
// tslint:disable-next-line:no-any
declare const window: { [x: string]: any };

// We would override __webpack_public_path__ only if __WPACKIO__ webpack plugin is set
if (__WPACKIO__) {
	__webpack_public_path__ = window[
		`__wpackIo${__WPACKIO__.appName}${__WPACKIO__.outputPath}`
	] as string;
}
