import './style.scss';
import './style.less';
import img from './assets/img.jpg';

const mainNode = document.querySelector('#main-app');
const dynamicNode = document.querySelector('#dyn-app');
const imgTag = document.querySelector('#img-tag');

mainNode.textContent = 'This is main app';
imgTag.innerHTML = `<img src="${img}" />`;

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
