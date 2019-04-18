/* eslint-disable spaced-comment */
///<reference types="webpack-env" />

import { strRepeat } from './module';

console.log('Hello from typescript, I am gonna say foo 30 times');
console.log(strRepeat('foo', 10));
console.log(strRepeat('foo', 10));
console.log(strRepeat('foo', 10));
console.log(strRepeat('10', 20));
console.log(strRepeat('[]', 20));

if (module.hot) {
	module.hot.accept('./module.ts', () => {
		const rp = require('./module').strRepeat;
		console.log(rp('foo', 10));
	});
}
