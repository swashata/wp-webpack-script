import { updateText } from './module';
// tslint:disable-next-line:no-import-side-effect
import './style.scss';
import './style.less';

const mainNode = document.querySelector('#ts-app');
if (mainNode) {
	updateText(mainNode, 'I am ts app');
}

import('./dynamic').then(({ updateNode }) => {
	const dynNode = document.querySelector('#ts-dyn-app');
	if (dynNode) {
		updateNode(dynNode, 'I am dynamically imported from ts module');
	}
});

if (module.hot) {
	module.hot.accept('./module', () => {
		// tslint:disable-next-line:no-shadowed-variable
		const { updateText } = require('./module');
		updateText(mainNode, 'I am HMRed');
	});
}
