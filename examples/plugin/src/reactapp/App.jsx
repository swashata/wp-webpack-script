import React from 'react';
import { hot } from 'react-hot-loader';
import Box from './components/Box';
import Todo from './components/Todo';
import svgUrl, { ReactComponent as CatSvg } from './components/svg.svg';

const App = () => (
	<Box heading="Hello From React">
		<p>I can be hot reloaded!</p>
		<p>Here is an SVG component</p>
		<CatSvg height="64px" width="64px" />
		<p>
			The URL is <code>{svgUrl}</code>
		</p>
		<p>Heres something of an app.</p>
		<h4>Todo App.!</h4>
		<Todo />
		<h4>Below is the same SVG with Style</h4>
		<div className="div-svg" />
	</Box>
);

export default hot(module)(App);
