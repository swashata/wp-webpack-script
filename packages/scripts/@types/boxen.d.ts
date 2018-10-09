declare module 'boxen' {
	type borderstyle = 'single' | 'double' | 'round' | 'single-double'
		| 'double-single' | 'classic' | {
			topLeft: string,
			topRight: string,
			bottomLeft: string,
			bottomRight: string,
			horizontal: string,
			vertical: string,
		}
	interface CssProperty {
		top: number;
		right: number;
		bottom: number;
		left: number;
	}
	type alignment = 'right' | 'center' | 'left';
	interface Options {
		borderColor?: string;
		borderStyle?: borderstyle;
		dimBorder?: boolean;
		padding?:number | CssProperty;
		margin?: number | CssProperty;
		float?: alignment;
		backgroundColor?: string;
		align?: alignment;
	}
	export default function boxen(input: string, options: Options): string;
}
