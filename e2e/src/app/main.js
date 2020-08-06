import './style.less';
import img from './assets/img.jpg';

import './lib';

console.log(__webpack_public_path__);
console.log(__WPACKIO__);

const path = (__WPACKIO__.appName + __WPACKIO__.outputPath).replace(
	/[^a-z0-9_-]/g,
	''
);
console.log(path);

const mainNode = document.querySelector('#main-app');
const dynamicNode = document.querySelector('#dyn-app');
const imgTag = document.querySelector('#img-tag');

mainNode.textContent = 'This is main app';
imgTag.innerHTML = `<img src="${img}" />`;

import('./dynamic').then(({ dynamic }) => {
	dynamic(dynamicNode);
});

const nested = { foo: { bar: 'bam' } };
console.log(nested?.foo?.bar?.biz);
console.log(nested?.foo?.bar);

// HMR
if (module.hot) {
	module.hot.accept('./dynamic', () => {
		/* eslint-disable global-require */
		const { dynamic } = require('./dynamic');
		dynamic(dynamicNode, 'I am HMRed');
	});
}
