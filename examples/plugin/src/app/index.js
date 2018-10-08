import '../publicPathIndex';
import './index.css';
import imgURL from './image.png';
import logger from './modules/logger';

console.log(typeof process.env.NODE_ENV);
console.log(typeof process.env.BABEL_ENV);
console.log(process.env.BABEL_ENV);
console.log('Hello World', imgURL);
console.log('Hello World', imgURL);
console.log('Hello World', imgURL);

console.log('I am through stuff');
console.log('I am too');

logger();

// Dynamic import
import('./modules/dynamic.js').then(({ default: _ }) => {
	_();
});

if (module.hot) {
	module.hot.accept('./modules/logger.js', () => {
		/* eslint-disable global-require */
		const newLogger = require('./modules/logger').default;
		newLogger();
	});
	module.hot.accept('./modules/dynamic.js', () => {
		/* eslint-disable global-require */
		const newLogger = require('./modules/dynamic').default;
		newLogger();
	});
}
