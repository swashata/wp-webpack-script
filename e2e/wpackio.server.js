module.exports = {
	// Your LAN IP or host where you would want the live server
	// Override this if you know your correct external IP (LAN)
	// Otherwise, the system will always use localhost and will not
	// work for external IP.
	// This will also create some issues with file watching because for
	// some reason, service-worker doesn't work on localhost?
	// https://github.com/BrowserSync/browser-sync/issues/1295
	// So it is recommended to change this to your LAN IP.
	// If you intend to access it from your LAN (probably do?)
	// If you keep null, then wpackio-scripts will try to determine your LAN IP
	// on it's own, which might not always be satisfying. But it is in most cases.
	host: '127.0.0.1',
	// Your WordPress development server address
	// This is super important
	proxy: 'http://localhost:5000',
	// PORT on your localhost where you would want live server to hook
	port: 3000,
	// UI passed directly to browsersync
	ui: {
		port: 3001,
	},
	// Whether to show the "BrowserSync Connected"
	notify: false,
	// Open the local URL, set to false to disable
	open: false,
	// BrowserSync ghostMode, set to false to completely disable
	ghostMode: {
		clicks: false,
		scroll: false,
		forms: false,
	},
};
