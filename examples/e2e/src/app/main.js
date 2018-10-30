const mainNode = document.querySelector('#main-app');
const dynamicNode = document.querySelector('#dyn-app');

mainNode.textContent = 'This is main app';
import('./dynamic').then(({ dynamic }) => {
	dynamic(dynamicNode);
});
