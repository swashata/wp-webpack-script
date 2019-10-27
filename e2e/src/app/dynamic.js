/* eslint-disable import/prefer-default-export, no-param-reassign */
export function dynamic(node, text = 'I am dynamically imported') {
	node.textContent = text;
}

// HMR