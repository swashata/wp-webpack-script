import React from 'react';
import { hot } from 'react-hot-loader';
import Box from './components/Box';
import Todo from './components/Todo';

const App = () => (
	<Box heading="Hello From React">
		<p>I can be hot reloaded!</p>
		<p>Heres something of an app.</p>
		<h4>Todo App.!</h4>
		<Todo />
	</Box>
);

export default hot(module)(App);
