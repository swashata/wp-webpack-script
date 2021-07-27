---
title: Bootstrap wpackio-scripts to your project
order: 1
shortTitle: Bootstrap wpack.io
---

This guide covers in-depth how to get started or incorporate wpack.io tooling
into your WordPress project.

## Install the build tool

We have two way to get started with `@wpackio/scripts`.

### Bootstrap the files automatically

Using this way is recommended. It will not override any of your files and will
bootstrap needed files and `package.json` scripts automatically for you.

First cd into project directory.

```bash
cd awesome-plugin
```

Now run

```bash
npx @wpackio/cli
```

Once done, run

```bash
npm run bootstrap
```

OR if using `yarn` (the cli tool will auto-detect)

```bash
yarn bootstrap
```

This will create the following files:

- `wpackio.project.js` - Information and entry-points for your project (plugin
  or theme).
- `wpackio.server.js` - Information about your local development server. Make
  sure to add it to `.gitignore` file because it may differ for team members.
- `.browserslistrc` - For targeting your environment. More info
  [here](https://github.com/browserslist/browserslist). It is used by both babel
  and autoprefixer to make sure your javascript and css files work as expected.
- `postcss.config.js` - Additional configuration for your css files. Read
  [more](https://github.com/postcss/postcss#webpack). We have `autoprefixer`
  setup by default.

**NOTE** You must use `camelCase` format when defining `appName`. Otherwise it
will not work.

```js
// Good
module.exports = {
	appName: 'myAwesomeApp',
};

// BAD
module.exports = {
	appName: 'my-awesome-app',
};
```

Now you are ready to go.

### Bootstrap the files manually.

Please read [here](/tutorials/manual-project-bootstrap/).

## Mention entry-points

Now edit your `wpackio.project.js` file and at the very least, mention the
entry-points.

Here you start thinking in terms of
[ES6 Modules](http://2ality.com/2014/09/es6-modules-final.html) and specify the
files, which imports other files.

If you have, files `src/main.js` and `src/mobile.js`, which are ES6 Modules and
runs everything, then you can have your project config something like this.

```js
module.exports = {
	// ...
	// Files we need to compile, and where to put
	files: [
		// If this has length === 1, then single compiler
		{
			name: 'app',
			entry: {
				main: ['./src/main.js'],
				mobile: ['./src/mobile.js'],
			},
			// Extra webpack config to be passed directly
			webpackConfig: undefined,
		},
	],
};
```

Your `src/main.js` may look something like this

```js
import React from 'react';
import App from './App';
import './style.scss';

document.addEventListener('DOMContentLoaded', () => {
	console.log('Hello from React');
	const entry = document.querySelector('#wpackio-reactapp');
	render(<App />, entry);
});
```

## Generate `server` config for team members

It is very much possible that different team members use different types of
local server. `@wpackio/scripts` doesn't come into you way and forces you to
change this.

Instead it provides a way to automatically generate server config for each of
your team member.

The only requirement here is to make sure you have `wpackio.server.js` in your
`.gitignore` file.

Then ask your members to run

```bash
npm run bootstrap
```

`@wpackio/scripts` will realize that the project is already configured and will
only ask the user for the URL of the `development` server. It is usually the URL
provided by wamp, mamp, vvv etc. Just enter that and the `wpackio.server.js`
will be automatically created for you.

---

Now we have the node dependencies set. It is time to use PHP dependency to
actually enqueue the files. Keep on reading
[the next part of quick start guide](/guides/using-wpackio-enqueue/).
