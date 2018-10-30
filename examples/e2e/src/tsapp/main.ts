import { updateText } from './module';

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
