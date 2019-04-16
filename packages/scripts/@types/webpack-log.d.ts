declare module 'webpack-log' {
	interface WebpackLogOptions {
		name?: string;
		level?: 'info' | 'warn' | 'error' | 'trace' | 'debug' | 'silent';
		unique?: boolean;
		timestamp?: boolean;
	}

	interface WebpackLogger {
		info: (str: string) => void;
		warn: (str: string) => void;
		error: (str: string) => void;
		trace: (str: string) => void;
		debug: (str: string) => void;
	}
	export default function log(options: WebpackLogOptions): WebpackLogger;
}
