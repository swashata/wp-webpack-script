/**
 * A custom error class to make built-in errors standout
 * from node related errors.
 */
export class WpackioError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'WpackioError';
	}
}
