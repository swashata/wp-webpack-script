import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './index.scss';

document.addEventListener('DOMContentLoaded', () => {
	console.log('Hello from React');
	const entry = document.querySelector('#wpackio-reactapp');
	render(<App />, entry);
});
