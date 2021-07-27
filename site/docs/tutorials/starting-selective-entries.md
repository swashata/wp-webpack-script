---
title: Starting selective entries with Webpack MultiCompiler
order: 2
shortTitle: Start selective entries
---

> This feature is available since v6.4.0

When you supply more than one file object to the `files` directive of
`wpackio.project.js`, then wpackio starts webpack in multi compiler mode. This
is useful for having separate dependency tree between separate parts of the
project.

There is also a feature to start the development server for selective entries.

Let's say, your wpackio.project.js looks like this:

```js
module.exports = {
	files: [
		{
			name: 'app',
			entry: {
				main: ['./src/app/index.js'],
			},
			optimizeForGutenberg: false,
			webpackConfig: undefined,
		},
		{
			name: 'admin',
			entry: {
				main: ['./src/admin/index.js'],
			},
			optimizeForGutenberg: false,
			webpackConfig: undefined,
		},
	],
	// ...
};
```

Here we have two `files` entry `app` and `admin`. You may want to start just the
`admin` entry. In such case, run the start command like this

```bash
yarn start --entries admin
# or if using npm
npm start -- --entries admin
```

This will start just the `admin` entry of `files`. This is useful for large
codebases where you are probably working on a single part of the app and don't
want to run all files to keep things fast.
