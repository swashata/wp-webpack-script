describe('entrypoint', () => {
	test('sets __webpack_public_path__ from WPACKIO(webpack.DefinePlugin)', () => {
		const oldGlobal = global;
		expect((global as { [x: string]: any }).__webpack_public_path__).toBe(
			''
		);
		// Require our package
		require('../src/entrypoint');
		// tslint:disable-next-line:no-any
		expect((global as { [x: string]: any }).__webpack_public_path__).toBe(
			'/biz/baz'
		);
		// tslint:disable-next-line:no-any
		(global as any) = oldGlobal;
	});
});
