---
title: Using React Hot Loader with wpack.io
order: 3
shortTitle: Use React Hot Loader
---

Let's focus on an example where we use the great [react hot loader](https://github.com/gaearon/react-hot-loader)
to have the best in class DX when developing react app. It can be found in action
under [`examples/plugin`](https://github.com/swashata/wp-webpack-script/tree/master/examples/plugin)
of the repo.

## Installation

First install the dependency

```bash
npm i react-hot-loader
```

## Modify wpackio project config

From the documentation of react hot loader, it states that we need to add a plugin
to `babel-loader`. For that, let's hack into webpack config using `jsBabelOverride`
from `wpackio.project.io`.

**`wpackio.project.io`**

```js
module.exports = {
	// ...
	// Hook into babeloverride so that we can add react-hot-loader plugin
	jsBabelOverride: defaults => ({
		...defaults,
		plugins: ['react-hot-loader/babel'],
	}),
	// ...
};
```

This would instruct wpackio to extend [`babel-loader`](https://github.com/babel/babel-loader)
options and include the babel plugin provided by react-hot-loader.

## Customize our App

Let's say we have `src/app/main.jsx` as our primary entry-point. It has the following
code.

```jsx
import React from 'react';
import { render } from 'react-dom';
import App from './App';

document.addEventListener('DOMContentLoaded', () => {
	const entry = document.querySelector('#wpackio-reactapp');
	render(<App />, entry);
});
```

Here the `App.jsx` is the main react application.

So let's edit `src/app/App.jsx` file and modify the content.

```diff
import React from 'react';
+ import { hot } from 'react-hot-loader';

const App = () => (
	<div className="App">
		<h2>Hello From React</h2>
	</div>
);

- export default App;
+ export default hot(module)(App);
```

Now make changes and see it load live without page refresh.

![React HMR](./react-hmr.gif)
