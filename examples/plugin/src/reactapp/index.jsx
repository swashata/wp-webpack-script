import React from 'react';
import { render } from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const entry = document.querySelector('#wpackio-reactapp');
	render(<App />, entry);
});
