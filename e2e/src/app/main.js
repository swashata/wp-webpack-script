import './style.scss';

const mainNode = document.querySelector('#main-app');
const dynamicNode = document.querySelector('#dyn-app');

mainNode.textContent = 'This is main app';
import('./dynamic').then(({ dynamic }) => {
	dynamic(dynamicNode);
});

// HMR
if (module.hot) {
	module.hot.accept('./dynamic', () => {
		/* eslint-disable global-require */
		const { dynamic } = require('./dynamic');
		dynamic(dynamicNode, 'I am HMRed');
	});
}
