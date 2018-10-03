import * as browserSync from 'browser-sync';

export interface ServerConfig {
	host?: string;
	proxy: string;
	port: number;
	ui: browserSync.Options['ui'];
	notify: boolean;
	open: boolean;
	ghostMode: browserSync.Options['ghostMode'];
}

export const serverConfigDefault: ServerConfig = {
	// Your LAN IP or host where you would want the live server
	// Override this if you know your correct external IP (LAN)
	// Otherwise, the system will always use localhost and will not
	// work for external IP.
	// So it is recommended to change this to your LAN IP.
	// If you intend to access it from your LAN (probably do?)
	host: undefined,
	// Your WordPress development server address
	proxy: 'http://localhost',
	// PORT on your localhost where you would want live server to hook
	port: 3000,
	// UI passed directly to browsersync
	ui: {
		port: 3001,
		weinre: {
			port: 8080,
		},
	},
	// Whether to show the "BrowserSync Connected"
	notify: false,
	// Open the local URL, set to false to disable
	open: true,
	// BrowserSync ghostMode, set to false to completely disable
	ghostMode: {
		clicks: true,
		scroll: true,
		forms: true,
	},
};
