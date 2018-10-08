import '../publicPathIndex';
import bar from './bar';

bar();

/* eslint-disable global-require */
if (module.hot) {
	module.hot.accept('./bar.js', () => {
		const newBar = require('./bar').default;
		newBar();
	});
}
