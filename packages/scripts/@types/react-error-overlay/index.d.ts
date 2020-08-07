declare module 'react-error-overlay' {
	namespace ErrorOverlay {
		function setEditorHandler(fn: (errorLocation: any) => void);
		function startReportingRuntimeErrors(handlers: {
			onError: () => void;
			filename: string;
		});

		function stopReportingRuntimeErrors(): void;

		function reportBuildError(err: string): void;

		function dismissBuildError(): void;

		function dismissRuntimeErrors(): void;

		function reportRuntimeError(): void;
	}

	export = ErrorOverlay;
}
