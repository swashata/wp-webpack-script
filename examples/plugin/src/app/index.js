import './index.css';
import imgURL from './image.png';
import logger from './modules/logger';
import svgURL from './svg.svg';

console.log('Heres an URL of dynamically imported asset.');
console.log(imgURL);
console.log(svgURL);

console.log('I can not be hot-reloaded!');
console.log('But my imports can be😉!@');

logger();

// Dynamic import
/* globals __webpack_public_path__ __WPACKIO__ */
console.log({ publicPath: __webpack_public_path__, wpackio: __WPACKIO__ });
import('./modules/dynamic.js').then(({ default: _ }) => {
	console.log('I am dynamically imported!');
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
