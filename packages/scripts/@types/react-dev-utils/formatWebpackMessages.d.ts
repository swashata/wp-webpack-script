declare module 'react-dev-utils/formatWebpackMessages' {
	import * as webpack from 'webpack';
	export default function formatWebpackMessages(
		message: any,
		isError?: boolean
	): { errors: string[]; warnings: string[] };
}
