# `@wpackio/eslint-config`

Shared ESLint configuration for all `@wpackio` packages and more. It has shared
config for both JavaScript and TypeScript projects.

Note that this doesn't come installed with `@wpackio/scripts`. If you wish to
take advantage of this config, then install and use on your own.

## Installation

If using `yarn`

```bash
yarn add --dev @wpackio/eslint-config eslint prettier
```

or with `npm`

```bash
npm i -D @wpackio/eslint-config eslint prettier
```

## Usage with JavaScript

Using it with JavaScript project is very simple. Create a `.eslintrc.js` file in the root of your project and put the code.

```js
module.exports = {
	extends: '@wpackio',
};
```

## Usage with TypeScript

Using with typescript requires a little more effort. In the same `.eslintrc.js`
file, put

```js
module.exports = {
	extends: ['@wpackio/eslint-config/ts'],
	parserOptions: {
		project: './tsconfig.json',
		tsconfigRootDir: __dirname,
	},
	settings: {
		'import/resolver': {
			typescript: {
				directory: __dirname,
			},
		},
	},
};
```

Putting `__dirname` in `parserOptions.tsconfigRootDir` and `['import/resolver'].typescript`
is necessary because of [this issue](https://github.com/typescript-eslint/typescript-eslint/issues/251).

For both the cases you can also extend upon the rules.

## Prettier config

Create a `prettier.config.js` file in the root of your project and put the code.

```js
module.exports = require('@wpackio/eslint-config/prettier.config');
```

Now you are ready to go.

## VSCode Integration

Install the [eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
plugin for VSCode. Enable autoFormat for `javascript` and `javascriptreact` files.

- Go to Code > Preference [File > Preference for Windows & Linux].
- Edit the WorkSpace Settings (Recommended).

```json
{
	"eslint.autoFixOnSave": true,
	"[javascript]": {
		"editor.formatOnSave": false
	},
	"[javascriptreact]": {
		"editor.formatOnSave": false
	}
}
```

If you are using for typescript files, the following additional settings are needed.

```json
{
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		{ "language": "typescript", "autoFix": true },
		{ "language": "typescriptreact", "autoFix": true }
	]
}
```

## Development

This package has the same `npm scripts` as this monorepo. These should be run
using `lerna run <script>`. More information can be found under [CONTRIBUTION.md](../../CONTRIBUTION.md).

- `build`: Use babel to build for nodejs 8.6+. Files inside `src` are compiled and put under `lib`. All type definitions are stripped and individual type declaration files are created.
- `prepare`: Run `build` after `yarn` and before `publish`.
- `lint`: Lint all files using tslint.
- `test`: Run tests on files using jest.
